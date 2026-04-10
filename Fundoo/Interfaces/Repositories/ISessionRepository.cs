using Fundoo.Models;

namespace Fundoo.Interfaces.Repositories;

public interface ISessionRepository
{
    Task AddAsync(UserSession session);
    Task<List<UserSession>> GetActiveSessionsAsync(int userId);
    Task<UserSession?> GetByIdAsync(int id);
    Task<UserSession?> GetByRefreshTokenAsync(string refreshToken);
    Task SaveChangesAsync();
}
