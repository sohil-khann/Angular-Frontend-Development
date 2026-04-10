using Fundoo.DTOs.Sessions;
using Fundoo.Helpers;
using Fundoo.Interfaces.Repositories;
using Fundoo.Interfaces.Services;
using System.IdentityModel.Tokens.Jwt;

namespace Fundoo.Services;

public class SessionService : ISessionService
{
    private readonly ISessionRepository _sessionRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICacheService _cacheService;

    public SessionService(ISessionRepository sessionRepository, IUserRepository userRepository, ICacheService cacheService)
    {
        _sessionRepository = sessionRepository;
        _userRepository = userRepository;
        _cacheService = cacheService;
    }

    public async Task<ServiceResult<UserSessionsDto>> GetActiveSessionsAsync(int userId, string currentTokenId)
    {
        var cacheKey = $"user_sessions:{userId}";
        var cached = await _cacheService.GetAsync<UserSessionsDto>(cacheKey);
        if (cached != null)
        {
            return ServiceResult<UserSessionsDto>.Ok(cached);
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ServiceResult<UserSessionsDto>.Fail("User not found.");
        }

        var sessions = await _sessionRepository.GetActiveSessionsAsync(userId);
        var result = new UserSessionsDto
        {
            UserId = user.Id,
            Email = user.Email,
            ActiveSessionsCount = sessions.Count(x => x.IsActive),
            Sessions = sessions.Select(x => new SessionInfoDto
            {
                SessionId = x.Id,
                IpAddress = x.IpAddress,
                UserAgent = x.UserAgent,
                CreatedAt = x.CreatedAt,
                ExpiresAt = x.ExpiresAt,
                IsCurrentSession = HasTokenId(x.SessionToken, currentTokenId),
                IsActive = x.IsActive
            }).ToList()
        };

        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5));
        return ServiceResult<UserSessionsDto>.Ok(result);
    }

    public async Task<ServiceResult> TerminateSessionAsync(int sessionId, int userId)
    {
        var session = await _sessionRepository.GetByIdAsync(sessionId);
        if (session == null || session.UserId != userId)
        {
            return ServiceResult.Fail("Session not found.");
        }

        session.IsActive = false;
        session.UpdatedAt = DateTime.UtcNow;
        await _sessionRepository.SaveChangesAsync();
        await _cacheService.RemoveAsync($"user_sessions:{userId}");

        return ServiceResult.Ok("Session terminated successfully.");
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

    public async Task<ServiceResult> TerminateAllOtherSessionsAsync(int userId, string currentTokenId)
    {
        var sessions = await _sessionRepository.GetActiveSessionsAsync(userId);
        foreach (var session in sessions)
        {
            if (!HasTokenId(session.SessionToken, currentTokenId))
            {
                session.IsActive = false;
                session.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _sessionRepository.SaveChangesAsync();
        await _cacheService.RemoveAsync($"user_sessions:{userId}");

        return ServiceResult.Ok("All other sessions terminated successfully.");
    }
}
