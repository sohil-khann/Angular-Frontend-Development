using Fundoo.Data;
using Fundoo.Interfaces.Repositories;
using Fundoo.Models;
using Microsoft.EntityFrameworkCore;

namespace Fundoo.Repositories;

public class UserRepository : IUserRepository
{
    private readonly FundooDbContext _context;

    public UserRepository(FundooDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.Email == email && !x.IsDeleted);
    }

    public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken && !x.IsDeleted);
    }

    public async Task<User?> GetByVerificationTokenAsync(string token)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.EmailVerificationToken == token );
    }

    public async Task<User?> GetByPasswordResetTokenAsync(string token)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.PasswordResetToken == token && !x.IsDeleted);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
