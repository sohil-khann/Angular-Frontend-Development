using Fundoo.DTOs.Notes;
using Fundoo.Models;

namespace Fundoo.Interfaces.Repositories;

public interface INoteRepository
{
    Task<List<Note>> GetAllForUserAsync(int userId, NoteFilterDto filter);
    Task<Note?> GetByIdForUserAsync(int id, int userId);
    Task<Note?> GetByIdOwnedByUserAsync(int id, int userId);
    Task AddAsync(Note note);
    Task SaveChangesAsync();
    void DeleteMany(List<Note> notes);
}
