using Fundoo.Configurations;
using Fundoo.DTOs.Auth;
using Fundoo.Helpers;
using Fundoo.Interfaces.Repositories;
using Fundoo.Interfaces.Services;
using Fundoo.Models;
using Microsoft.Extensions.Options;
using System.Net;
using System.IdentityModel.Tokens.Jwt;

namespace Fundoo.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ISessionRepository _sessionRepository;
    private readonly IJwtTokenHelper _jwtTokenHelper;
    private readonly IEmailService _emailService;
    private readonly JwtSettings _jwtSettings;
    private readonly FrontendSettings _frontendSettings;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        ISessionRepository sessionRepository,
        IJwtTokenHelper jwtTokenHelper,
        IEmailService emailService,
        IOptions<JwtSettings> jwtOptions,
        IOptions<FrontendSettings> frontendOptions,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _sessionRepository = sessionRepository;
        _jwtTokenHelper = jwtTokenHelper;
        _emailService = emailService;
        _jwtSettings = jwtOptions.Value;
        _frontendSettings = frontendOptions.Value;
        _logger = logger;
    }

    public async Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto, string? ipAddress, string? userAgent)
    {
        var email = dto.Email.Trim().ToLower();
        var existingUser = await _userRepository.GetByEmailAsync(email);
        if (existingUser != null)
        {
            return ServiceResult<AuthResponseDto>.Fail("Email is already registered.");
        }

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName, 
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, 12),
            EmailVerificationToken = CreateVerificationToken()
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
        await TrySendVerificationEmailAsync(user);

        return await CreateAuthResponseAsync(user, ipAddress, userAgent);
    }

    public async Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto, string? ipAddress, string? userAgent)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.Trim().ToLower());
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return ServiceResult<AuthResponseDto>.Fail("Invalid email or password.");
        }

        if (!user.IsEmailVerified && string.IsNullOrWhiteSpace(user.EmailVerificationToken))
        {
            EnsureVerificationToken(user);
            await _userRepository.SaveChangesAsync();
        }

        return await CreateAuthResponseAsync(user, ipAddress, userAgent);
    }

    public async Task<ServiceResult<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto dto)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(dto.RefreshToken);
        if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            return ServiceResult<AuthResponseDto>.Fail("Refresh token is invalid or expired.");
        }

        var session = await _sessionRepository.GetByRefreshTokenAsync(dto.RefreshToken);
        if (session == null || !session.IsActive)
        {
            return ServiceResult<AuthResponseDto>.Fail("Session is not active.");
        }

        var accessToken = _jwtTokenHelper.GenerateAccessToken(user);
        var newRefreshToken = _jwtTokenHelper.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenDays);
        user.UpdatedAt = DateTime.UtcNow;

        session.SessionToken = accessToken.token;
        session.RefreshToken = newRefreshToken;
        session.ExpiresAt = accessToken.expiresAt;
        session.UpdatedAt = DateTime.UtcNow;

        await _userRepository.SaveChangesAsync();
        await _sessionRepository.SaveChangesAsync();

        return ServiceResult<AuthResponseDto>.Ok(new AuthResponseDto
        {
            UserId = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            IsEmailVerified = user.IsEmailVerified,
            Token = accessToken.token,
            RefreshToken = newRefreshToken,
            TokenExpiry = accessToken.expiresAt
        }, "Token refreshed successfully.");
    }

    public async Task<ServiceResult> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.Trim().ToLower());
        if (user == null)
        {
            return ServiceResult.Ok("If the email exists, a reset mail has been sent.");
        }

        user.PasswordResetToken = Guid.NewGuid().ToString();
        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.SaveChangesAsync();
        try
        {
            await _emailService.SendEmailAsync(
                user.Email,
                "Reset your Fundoo password",
                BuildResetPasswordBody(user.PasswordResetToken ?? string.Empty));
        }
        catch (InvalidOperationException ex)
        {
            return ServiceResult.Fail(ex.Message);
        }

        return ServiceResult.Ok("Password reset email sent.");
    }

    public async Task<ServiceResult> ResetPasswordAsync(ResetPasswordDto dto)
    {
        var user = await _userRepository.GetByPasswordResetTokenAsync(dto.Token);
        if (user == null || user.PasswordResetTokenExpiry < DateTime.UtcNow)
        {
            return ServiceResult.Fail("Reset token is invalid or expired.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword, 12);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.SaveChangesAsync();

        return ServiceResult.Ok("Password reset successfully.");
    }

    public async Task<ServiceResult> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ServiceResult.Fail("User not found.");
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
        {
            return ServiceResult.Fail("Current password is incorrect.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword, 12);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.SaveChangesAsync();

        return ServiceResult.Ok("Password changed successfully.");
    }

    public async Task<ServiceResult> VerifyEmailAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return ServiceResult.Fail("Verification token is required. Open the latest verification email or request a new one.");
        }

        var user = await _userRepository.GetByVerificationTokenAsync(token);
        if (user == null)
        {
            return ServiceResult.Fail("This verification link is invalid or has already been used. Request a new verification email and try again.");
        }

        user.IsEmailVerified = true;
        user.EmailVerificationToken = null;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.SaveChangesAsync();

        return ServiceResult.Ok("Email verified successfully.");
    }

    public async Task<ServiceResult> ResendVerificationEmailAsync(ForgotPasswordDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.Trim().ToLower());
        if (user == null)
        {
            return ServiceResult.Fail("User not found.");
        }

        if (user.IsEmailVerified)
        {
            return ServiceResult.Ok("Email is already verified.");
        }

        EnsureVerificationToken(user, forceRefresh: true);
        await _userRepository.SaveChangesAsync();

        try
        {
            await _emailService.SendEmailAsync(
                user.Email,
                "Verify your Fundoo email",
                BuildVerifyEmailBody(user.EmailVerificationToken ?? string.Empty));
        }
        catch (InvalidOperationException ex)
        {
            return ServiceResult.Fail(ex.Message);
        }
        return ServiceResult.Ok("Verification email sent.");
    }

    public async Task<ServiceResult> LogoutAsync(int userId, string tokenId, LogoutDto dto)
    {
        var sessions = await _sessionRepository.GetActiveSessionsAsync(userId);
        if (dto.LogoutAllDevices)
        {
            foreach (var session in sessions)
            {
                session.IsActive = false;
                session.UpdatedAt = DateTime.UtcNow;
            }

            await _sessionRepository.SaveChangesAsync();
            return ServiceResult.Ok("Logged out from all devices.");
        }

        var currentSession = sessions.FirstOrDefault(x => HasTokenId(x.SessionToken, tokenId));
        if (currentSession == null)
        {
            currentSession = sessions.FirstOrDefault();
        }

        if (currentSession != null)
        {
            currentSession.IsActive = false;
            currentSession.UpdatedAt = DateTime.UtcNow;
            await _sessionRepository.SaveChangesAsync();
        }

        return ServiceResult.Ok("Logged out successfully.");
    }

    private static bool HasTokenId(string sessionToken, string tokenId)
    {
        if (string.IsNullOrWhiteSpace(sessionToken) || string.IsNullOrWhiteSpace(tokenId))
        {
            return false;
        }

        var handler = new JwtSecurityTokenHandler();
        if (!handler.CanReadToken(sessionToken))
        {
            return false;
        }

        var token = handler.ReadJwtToken(sessionToken);
        return string.Equals(token.Id, tokenId, StringComparison.Ordinal);
    }

    private async Task<ServiceResult<AuthResponseDto>> CreateAuthResponseAsync(User user, string? ipAddress, string? userAgent)
    {
        var accessToken = _jwtTokenHelper.GenerateAccessToken(user);
        var refreshToken = _jwtTokenHelper.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenDays);
        user.UpdatedAt = DateTime.UtcNow;

        var session = new UserSession
        {
            UserId = user.Id,
            SessionToken = accessToken.token,
            RefreshToken = refreshToken,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            ExpiresAt = accessToken.expiresAt
        };

        await _sessionRepository.AddAsync(session);
        await _userRepository.SaveChangesAsync();
        await _sessionRepository.SaveChangesAsync();

        _logger.LogInformation("User {Email} signed in.", user.Email);

        return ServiceResult<AuthResponseDto>.Ok(new AuthResponseDto
        {
            UserId = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            IsEmailVerified = user.IsEmailVerified,
            Token = accessToken.token,
            RefreshToken = refreshToken,
            TokenExpiry = accessToken.expiresAt
        });
    }

    private string BuildVerifyEmailBody(string token)
    {
        var encodedToken = WebUtility.UrlEncode(token);
        var verifyUrl = $"{GetFrontendBaseUrl()}/verify-email?token={encodedToken}";

        return $"""
        <h2>Verify your Fundoo email</h2>
        <p>Thanks for creating your Fundoo account.</p>
        <p><a href="{verifyUrl}">Click here to verify your email</a></p>
        <p>If the button does not work, use this token inside the app:</p>
        <p><strong>{WebUtility.HtmlEncode(token)}</strong></p>
        """;
    }

    private string BuildResetPasswordBody(string token)
    {
        var encodedToken = WebUtility.UrlEncode(token);
        var resetUrl = $"{GetFrontendBaseUrl()}/reset-password?token={encodedToken}";

        return $"""
        <h2>Reset your Fundoo password</h2>
        <p>We received a request to reset your password.</p>
        <p><a href="{resetUrl}">Click here to reset your password</a></p>
        <p>If the link does not work, use this token inside the app:</p>
        <p><strong>{WebUtility.HtmlEncode(token)}</strong></p>
        """;
    }

    private string GetFrontendBaseUrl()
    {
        return string.IsNullOrWhiteSpace(_frontendSettings.BaseUrl)
            ? "http://localhost:4200"
            : _frontendSettings.BaseUrl.TrimEnd('/');
    }

    private async Task TrySendVerificationEmailAsync(User user)
    {
        try
        {
            await _emailService.SendEmailAsync(
                user.Email,
                "Verify your Fundoo email",
                BuildVerifyEmailBody(user.EmailVerificationToken ?? string.Empty));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Verification email could not be sent for user {Email}.", user.Email);
        }
    }

    private static string CreateVerificationToken()
    {
        return Guid.NewGuid().ToString("N");
    }

    private static void EnsureVerificationToken(User user, bool forceRefresh = false)
    {
        if (user.IsEmailVerified)
        {
            return;
        }

        if (!forceRefresh && !string.IsNullOrWhiteSpace(user.EmailVerificationToken))
        {
            return;
        }

        user.EmailVerificationToken = CreateVerificationToken();
        user.UpdatedAt = DateTime.UtcNow;
    }
}
