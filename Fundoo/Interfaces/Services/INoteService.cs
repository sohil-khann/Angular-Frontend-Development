using Fundoo.DTOs.Notes;
using Fundoo.Helpers;

namespace Fundoo.Interfaces.Services;

public interface INoteService
{
    Task<ServiceResult<List<NoteResponseDto>>> GetAllAsync(int userId, NoteFilterDto filter);
    Task<ServiceResult<NoteResponseDto>> GetByIdAsync(int id, int userId);
    Task<ServiceResult<NoteResponseDto>> CreateAsync(int userId, CreateNoteDto dto);
    Task<ServiceResult<NoteResponseDto>> UpdateAsync(int id, int userId, UpdateNoteDto dto);
    Task<ServiceResult> DeleteAsync(int id, int userId);
    Task<ServiceResult<NoteResponseDto>> ToggleArchiveAsync(int id, int userId, bool isArchived);
    Task<ServiceResult<NoteResponseDto>> TogglePinAsync(int id, int userId, bool isPinned);
    Task<ServiceResult<NoteResponseDto>> ToggleTrashAsync(int id, int userId, bool isTrashed);
    Task<ServiceResult<NoteResponseDto>> RestoreAsync(int id, int userId);
    Task<ServiceResult> DeletePermanentlyAsync(int id, int userId);
    Task<ServiceResult> EmptyTrashAsync(int userId);
    Task<ServiceResult<List<NoteResponseDto>>> GetRemindersAsync(int userId, DateTime? fromDate, DateTime? toDate);
}
