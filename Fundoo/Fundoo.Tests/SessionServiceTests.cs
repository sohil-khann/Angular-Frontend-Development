using Fundoo.Configurations;
using Fundoo.Helpers;
using Fundoo.Models;
using Fundoo.Services;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace Fundoo.Tests;

[TestFixture]
public class SessionServiceTests
{
    [Test]
    public async Task GetActiveSessionsAsync_MarksOnlyTheMatchingJwtAsCurrent()
    {
        var sessionRepository = new FakeSessionRepository();
        var userRepository = new FakeUserRepository();
        var cacheService = new FakeCacheService();
        var user = new User
        {
            Id = 1,
            FirstName = "Asha",
            LastName = "Patel",
            Email = "asha@mail.com"
        };
        userRepository.Users.Add(user);

        var jwtSettings = Options.Create(new JwtSettings
        {
            Issuer = "FundooApi",
            Audience = "FundooUsers",
            SecretKey = "THIS_IS_A_TEST_SECRET_KEY_FOR_NUNIT_TESTS_ONLY",
            AccessTokenMinutes = 60,
            RefreshTokenDays = 7
        });
        var jwtHelper = new JwtTokenHelper(jwtSettings);
        var firstToken = jwtHelper.GenerateAccessToken(user);
        var secondToken = jwtHelper.GenerateAccessToken(user);

        sessionRepository.Sessions.Add(new UserSession
        {
            Id = 1,
            UserId = 1,
            SessionToken = firstToken.token,
            RefreshToken = "refresh-1",
            UserAgent = "Chrome",
            IsActive = true
        });
        sessionRepository.Sessions.Add(new UserSession
        {
            Id = 2,
            UserId = 1,
            SessionToken = secondToken.token,
            RefreshToken = "refresh-2",
            UserAgent = "Edge",
            IsActive = true
        });

        var service = new SessionService(sessionRepository, userRepository, cacheService);

        var result = await service.GetActiveSessionsAsync(1, secondToken.tokenId);

        Assert.That(result.Success, Is.True);
        Assert.That(result.Data, Is.Not.Null);
        Assert.That(result.Data!.Sessions.Count(x => x.IsCurrentSession), Is.EqualTo(1));
        Assert.That(result.Data.Sessions.Single(x => x.IsCurrentSession).SessionId, Is.EqualTo(2));
    }
}
