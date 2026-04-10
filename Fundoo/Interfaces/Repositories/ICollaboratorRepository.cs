using Fundoo.Models;

namespace Fundoo.Interfaces.Repositories;

public interface ICollaboratorRepository
{
    Task<List<NoteCollaborator>> GetForNoteAsync(int noteId);
    Task<NoteCollaborator?> GetByIdAsync(int id);
    Task<List<NoteCollaborator>> GetPendingInvitationsAsync(string email);
    Task AddAsync(NoteCollaborator collaborator);
    Task SaveChangesAsync();
}
