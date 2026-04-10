using Fundoo.Data;
using Fundoo.DTOs.Notes;
using Fundoo.Interfaces.Repositories;
using Fundoo.Models;
using Microsoft.EntityFrameworkCore;

namespace Fundoo.Repositories;

public class NoteRepository : INoteRepository
{
    private readonly FundooDbContext _context;

    public NoteRepository(FundooDbContext context)
    {
        _context = context;
    }

    public async Task<List<Note>> GetAllForUserAsync(int userId, NoteFilterDto filter)
    {
        IQueryable<Note> query = _context.Notes
            .Include(x => x.User)
            .Include(x => x.NoteLabels.Where(y => !y.IsDeleted))
                .ThenInclude(x => x.Label)
            .Include(x => x.Collaborators.Where(y => !y.IsDeleted))
                .ThenInclude(x => x.User)
            .Where(x => x.UserId == userId && !x.IsDeleted);

        if (filter.IsArchived.HasValue)
        {
            query = query.Where(x => x.IsArchived == filter.IsArchived.Value);
        }

        if (filter.IsPinned.HasValue)
        {
            query = query.Where(x => x.IsPinned == filter.IsPinned.Value);
        }

        if (filter.IsTrashed.HasValue)
        {
            query = query.Where(x => x.IsTrashed == filter.IsTrashed.Value);
        }

        if (filter.LabelId.HasValue)
        {
            query = query.Where(x => x.NoteLabels.Any(y => y.LabelId == filter.LabelId.Value && !y.IsDeleted));
        }

        return await query.OrderByDescending(x => x.IsPinned).ThenByDescending(x => x.UpdatedAt).ToListAsync();
    }

    public async Task<Note?> GetByIdForUserAsync(int id, int userId)
    {
        return await _context.Notes
            .Include(x => x.User)
            .Include(x => x.NoteLabels.Where(y => !y.IsDeleted))
                .ThenInclude(x => x.Label)
            .Include(x => x.Collaborators.Where(y => !y.IsDeleted))
                .ThenInclude(x => x.User)
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                !x.IsDeleted &&
                (x.UserId == userId || x.Collaborators.Any(y => y.UserId == userId && y.HasAccepted && !y.IsDeleted)));
    }

    public async Task<Note?> GetByIdOwnedByUserAsync(int id, int userId)
    {
        return await _context.Notes
            .Include(x => x.User)
            .Include(x => x.NoteLabels.Where(y => !y.IsDeleted))
                .ThenInclude(x => x.Label)
            .Include(x => x.Collaborators.Where(y => !y.IsDeleted))
                .ThenInclude(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId && !x.IsDeleted);
    }

    public async Task AddAsync(Note note)
    {
        await _context.Notes.AddAsync(note);
    }

    public void DeleteMany(List<Note> notes)
    {
        _context.Notes.RemoveRange(notes);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
