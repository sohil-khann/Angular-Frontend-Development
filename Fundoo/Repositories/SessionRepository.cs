using Fundoo.Data;
using Fundoo.Interfaces.Repositories;
using Fundoo.Models;
using Microsoft.EntityFrameworkCore;

namespace Fundoo.Repositories;

public class SessionRepository : ISessionRepository
{
    private readonly FundooDbContext _context;

    public SessionRepository(FundooDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(UserSession session)
    {
        await _context.UserSessions.AddAsync(session);
    }

    public async Task<List<UserSession>> GetActiveSessionsAsync(int userId)
    {
        return await _context.UserSessions
            .Where(x => x.UserId == userId && x.IsActive && !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<UserSession?> GetByIdAsync(int id)
    {
        return await _context.UserSessions.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<UserSession?> GetByRefreshTokenAsync(string refreshToken)
    {
        return await _context.UserSessions.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken && !x.IsDeleted);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
