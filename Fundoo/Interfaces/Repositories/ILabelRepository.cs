using Fundoo.Models;

namespace Fundoo.Interfaces.Repositories;

public interface ILabelRepository
{
    Task<List<Label>> GetAllForUserAsync(int userId);
    Task<Label?> GetByIdForUserAsync(int id, int userId);
    Task<List<Label>> GetByIdsForUserAsync(List<int> ids, int userId);
    Task AddAsync(Label label);
    Task SaveChangesAsync();
}
