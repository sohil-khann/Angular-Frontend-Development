using Fundoo.Data;
using Fundoo.Interfaces.Repositories;
using Fundoo.Models;
using Microsoft.EntityFrameworkCore;

namespace Fundoo.Repositories;

public class CollaboratorRepository : ICollaboratorRepository
{
    private readonly FundooDbContext _context;

    public CollaboratorRepository(FundooDbContext context)
    {
        _context = context;
    }

    public async Task<List<NoteCollaborator>> GetForNoteAsync(int noteId)
    {
        return await _context.NoteCollaborators
            .Where(x => x.NoteId == noteId).ToListAsync();
    }

    public async Task<NoteCollaborator?> GetByIdAsync(int id)
    {
        return await _context.NoteCollaborators
            .Include(x => x.Note)
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id  );
    }

    public async Task<List<NoteCollaborator>> GetPendingInvitationsAsync(string email)
    {
        return await _context.NoteCollaborators
            .Include(x => x.Note)
            .Include(x => x.User)
            .Where(x => x.CollaboratorEmail == email && !x.HasAccepted && !x.IsDeleted)
            .OrderByDescending(x => x.InvitationSentAt)
            .ToListAsync();
    }

    public async Task AddAsync(NoteCollaborator collaborator)
    {
        await _context.NoteCollaborators.AddAsync(collaborator);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
