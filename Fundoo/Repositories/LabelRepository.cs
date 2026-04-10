using Fundoo.Data;
using Fundoo.Interfaces.Repositories;
using Fundoo.Models;
using Microsoft.EntityFrameworkCore;

namespace Fundoo.Repositories;

public class LabelRepository : ILabelRepository
{
    private readonly FundooDbContext _context;

    public LabelRepository(FundooDbContext context)
    {
        _context = context;
    }

    public async Task<List<Label>> GetAllForUserAsync(int userId)
    {
        return await _context.Labels
            .Include(x => x.NoteLabels.Where(y => !y.IsDeleted))
            .Where(x => x.UserId == userId && !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<Label?> GetByIdForUserAsync(int id, int userId)
    {
        return await _context.Labels
            .Include(x => x.NoteLabels.Where(y => !y.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId && !x.IsDeleted);
    }

    public async Task<List<Label>> GetByIdsForUserAsync(List<int> ids, int userId)
    {
        return await _context.Labels
            .Where(x => ids.Contains(x.Id) && x.UserId == userId && !x.IsDeleted)
            .ToListAsync();
    }

    public async Task AddAsync(Label label)
    {
        await _context.Labels.AddAsync(label);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
