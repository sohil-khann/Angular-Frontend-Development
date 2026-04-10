using Fundoo.DTOs.Labels;
using Fundoo.DTOs.Notes;
using Fundoo.Helpers;

namespace Fundoo.Interfaces.Services;

public interface ILabelService
{
    Task<ServiceResult<List<LabelDto>>> GetAllAsync(int userId);
    Task<ServiceResult<LabelDto>> GetByIdAsync(int id, int userId);
    Task<ServiceResult<LabelDto>> CreateAsync(int userId, CreateLabelDto dto);
    Task<ServiceResult<LabelDto>> UpdateAsync(int id, int userId, UpdateLabelDto dto);
    Task<ServiceResult> DeleteAsync(int id, int userId);
    Task<ServiceResult<List<NoteResponseDto>>> GetNotesByLabelAsync(int id, int userId);
}
