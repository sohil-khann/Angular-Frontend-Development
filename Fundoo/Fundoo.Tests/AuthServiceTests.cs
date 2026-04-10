using Fundoo.Configurations;
using Fundoo.DTOs.Auth;
using Fundoo.Helpers;
using Fundoo.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace Fundoo.Tests;

[TestFixture]
public class AuthServiceTests
{
    [Test]
    public async Task RegisterAsync_CreatesUser_AndReturnsTokens()
    {
        var userRepository = new FakeUserRepository();
        var sessionRepository = new FakeSessionRepository();
        var emailService = new FakeEmailService();
        var service = CreateService(userRepository, sessionRepository, emailService);

        var dto = new RegisterDto
        {
            FirstName = "Asha",
            LastName = "Patel",
            Email = "ASHA@MAIL.COM",
            Password = "Password123",
            ConfirmPassword = "Password123"
        };

        var result = await service.RegisterAsync(dto, "127.0.0.1", "nunit");

        Assert.That(result.Success, Is.True);
        Assert.That(result.Data, Is.Not.Null);
        Assert.That(userRepository.Users.Count, Is.EqualTo(1));
        Assert.That(userRepository.Users[0].Email, Is.EqualTo("asha@mail.com"));
        Assert.That(userRepository.Users[0].PasswordHash, Is.Not.EqualTo(dto.Password));
        Assert.That(userRepository.Users[0].EmailVerificationToken, Is.Not.Null.And.Not.Empty);
        Assert.That(sessionRepository.Sessions.Count, Is.EqualTo(1));
        Assert.That(emailService.SentEmails.Count, Is.EqualTo(1));
        Assert.That(result.Data!.IsEmailVerified, Is.False);
        Assert.That(emailService.SentEmails[0].Body, Does.Contain("/verify-email?token="));
        Assert.That(emailService.SentEmails[0].Body, Does.Contain(userRepository.Users[0].EmailVerificationToken));
    }

    [Test]
    public async Task LoginAsync_WithWrongPassword_ReturnsFailure()
    {
        var userRepository = new FakeUserRepository();
        userRepository.Users.Add(new Fundoo.Models.User
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Patel",
            Email = "asha@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("RightPassword", 12)
        });

        var service = CreateService(userRepository, new FakeSessionRepository(), new FakeEmailService());

        var result = await service.LoginAsync(new LoginDto
        {
            Email = "asha@mail.com",
            Password = "WrongPassword"
        }, "127.0.0.1", "nunit");

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("Invalid email or password."));
    }

    [Test]
    public async Task ChangePasswordAsync_WithCorrectPassword_UpdatesHash()
    {
        var userRepository = new FakeUserRepository();
        var existingUser = new Fundoo.Models.User
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Patel",
            Email = "asha@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPassword", 12)
        };
        userRepository.Users.Add(existingUser);

        var service = CreateService(userRepository, new FakeSessionRepository(), new FakeEmailService());

        var result = await service.ChangePasswordAsync(1, new ChangePasswordDto
        {
            CurrentPassword = "OldPassword",
            NewPassword = "NewPassword123",
            ConfirmPassword = "NewPassword123"
        });

        Assert.That(result.Success, Is.True);
        Assert.That(BCrypt.Net.BCrypt.Verify("NewPassword123", existingUser.PasswordHash), Is.True);
    }

    [Test]
    public async Task ForgotPasswordAsync_SendsResetLink()
    {
        var userRepository = new FakeUserRepository();
        var existingUser = new Fundoo.Models.User
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Patel",
            Email = "asha@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPassword", 12)
        };
        userRepository.Users.Add(existingUser);

        var emailService = new FakeEmailService();
        var service = CreateService(userRepository, new FakeSessionRepository(), emailService);

        var result = await service.ForgotPasswordAsync(new ForgotPasswordDto
        {
            Email = "asha@mail.com"
        });

        Assert.That(result.Success, Is.True);
        Assert.That(existingUser.PasswordResetToken, Is.Not.Null.And.Not.Empty);
        Assert.That(emailService.SentEmails.Count, Is.EqualTo(1));
        Assert.That(emailService.SentEmails[0].Body, Does.Contain("/reset-password?token="));
    }

    [Test]
    public async Task VerifyEmailAsync_UpdatesVerificationStatus()
    {
        var userRepository = new FakeUserRepository();
        userRepository.Users.Add(new Fundoo.Models.User
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Patel",
            Email = "asha@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123", 12),
            EmailVerificationToken = "verify-token"
        });

        var service = CreateService(userRepository, new FakeSessionRepository(), new FakeEmailService());

        var result = await service.VerifyEmailAsync("verify-token");

        Assert.That(result.Success, Is.True);
        Assert.That(userRepository.Users[0].IsEmailVerified, Is.True);
        Assert.That(userRepository.Users[0].EmailVerificationToken, Is.Null);
    }

    [Test]
    public async Task LoginAsync_WhenUserIsUnverifiedAndTokenIsMissing_BackfillsVerificationToken()
    {
        var userRepository = new FakeUserRepository();
        userRepository.Users.Add(new Fundoo.Models.User
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Patel",
            Email = "asha@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123", 12),
            IsEmailVerified = false,
            EmailVerificationToken = null
        });

        var service = CreateService(userRepository, new FakeSessionRepository(), new FakeEmailService());

        var result = await service.LoginAsync(new LoginDto
        {
            Email = "asha@mail.com",
            Password = "Password123"
        }, "127.0.0.1", "nunit");

        Assert.That(result.Success, Is.True);
        Assert.That(userRepository.Users[0].EmailVerificationToken, Is.Not.Null.And.Not.Empty);
    }

    [Test]
    public async Task ResendVerificationEmailAsync_GeneratesNewToken_ForUnverifiedUser()
    {
        var userRepository = new FakeUserRepository();
        userRepository.Users.Add(new Fundoo.Models.User
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Patel",
            Email = "asha@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123", 12),
            IsEmailVerified = false,
            EmailVerificationToken = null
        });

        var emailService = new FakeEmailService();
        var service = CreateService(userRepository, new FakeSessionRepository(), emailService);

        var result = await service.ResendVerificationEmailAsync(new ForgotPasswordDto
        {
            Email = "asha@mail.com"
        });

        Assert.That(result.Success, Is.True);
        Assert.That(userRepository.Users[0].EmailVerificationToken, Is.Not.Null.And.Not.Empty);
        Assert.That(emailService.SentEmails.Count, Is.EqualTo(1));
        Assert.That(emailService.SentEmails[0].Body, Does.Contain(userRepository.Users[0].EmailVerificationToken));
    }

    [Test]
    public async Task LogoutAsync_UsesExactTokenIdMatch()
    {
        var userRepository = new FakeUserRepository();
        var sessionRepository = new FakeSessionRepository();
        var emailService = new FakeEmailService();
        var service = CreateService(userRepository, sessionRepository, emailService);
        var user = new Fundoo.Models.User
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Patel",
            Email = "asha@mail.com"
        };

        var jwtHelper = new JwtTokenHelper(CreateJwtSettings());
        var firstToken = jwtHelper.GenerateAccessToken(user);
        var secondToken = jwtHelper.GenerateAccessToken(user);

        sessionRepository.Sessions.Add(new Fundoo.Models.UserSession
        {
            Id = 1,
            UserId = 1,
            SessionToken = firstToken.token,
            RefreshToken = "refresh-1",
            IsActive = true
        });
        sessionRepository.Sessions.Add(new Fundoo.Models.UserSession
        {
            Id = 2,
            UserId = 1,
            SessionToken = secondToken.token,
            RefreshToken = "refresh-2",
            IsActive = true
        });

        var result = await service.LogoutAsync(1, secondToken.tokenId, new LogoutDto());

        Assert.That(result.Success, Is.True);
        Assert.That(sessionRepository.Sessions[0].IsActive, Is.True);
        Assert.That(sessionRepository.Sessions[1].IsActive, Is.False);
    }

    private static Microsoft.Extensions.Options.IOptions<JwtSettings> CreateJwtSettings()
    {
        return Options.Create(new JwtSettings
        {
            Issuer = "FundooApi",
            Audience = "FundooUsers",
            SecretKey = "THIS_IS_A_TEST_SECRET_KEY_FOR_NUNIT_TESTS_ONLY",
            AccessTokenMinutes = 60,
            RefreshTokenDays = 7
        });
    }

    private static AuthService CreateService(FakeUserRepository userRepository, FakeSessionRepository sessionRepository, FakeEmailService emailService)
    {
        var jwtSettings = CreateJwtSettings();
        var frontendSettings = Options.Create(new FrontendSettings
        {
            BaseUrl = "http://localhost:4200"
        });

        return new AuthService(
            userRepository,
            sessionRepository,
            new JwtTokenHelper(jwtSettings),
            emailService,
            jwtSettings,
            frontendSettings,
            NullLogger<AuthService>.Instance);
    }
}
