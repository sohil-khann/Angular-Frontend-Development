using Fundoo.DTOs.Sessions;
using Fundoo.Helpers;

namespace Fundoo.Interfaces.Services;

public interface ISessionService
{
    Task<ServiceResult<UserSessionsDto>> GetActiveSessionsAsync(int userId, string currentTokenId);
    Task<ServiceResult> TerminateSessionAsync(int sessionId, int userId);
    Task<ServiceResult> TerminateAllOtherSessionsAsync(int userId, string currentTokenId);
}
