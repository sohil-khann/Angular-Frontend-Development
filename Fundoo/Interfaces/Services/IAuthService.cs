using Fundoo.DTOs.Auth;
using Fundoo.Helpers;

namespace Fundoo.Interfaces.Services;

public interface IAuthService
{
    Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto, string? ipAddress, string? userAgent);
    Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto, string? ipAddress, string? userAgent);
    Task<ServiceResult<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto dto);
    Task<ServiceResult> ForgotPasswordAsync(ForgotPasswordDto dto);
    Task<ServiceResult> ResetPasswordAsync(ResetPasswordDto dto);
    Task<ServiceResult> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    Task<ServiceResult> VerifyEmailAsync(string token);
    Task<ServiceResult> ResendVerificationEmailAsync(ForgotPasswordDto dto);
    Task<ServiceResult> LogoutAsync(int userId, string tokenId, LogoutDto dto);
}
