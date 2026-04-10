using Fundoo.DTOs.Notes;
using Fundoo.Helpers;
using Fundoo.Interfaces.Repositories;
using Fundoo.Interfaces.Services;
using Fundoo.Models;

namespace Fundoo.Services;

public class NoteService : INoteService
{
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);
    private readonly INoteRepository _noteRepository;
    private readonly ILabelRepository _labelRepository;
    private readonly ICacheService _cacheService;

    public NoteService(INoteRepository noteRepository, ILabelRepository labelRepository, ICacheService cacheService)
    {
        _noteRepository = noteRepository;
        _labelRepository = labelRepository;
        _cacheService = cacheService;
    }

    public async Task<ServiceResult<List<NoteResponseDto>>> GetAllAsync(int userId, NoteFilterDto filter)
    {
        var notes = await _noteRepository.GetAllForUserAsync(userId, filter);
        return ServiceResult<List<NoteResponseDto>>.Ok(notes.Select(MappingHelper.ToNoteDto).ToList());
    }

    public async Task<ServiceResult<NoteResponseDto>> GetByIdAsync(int id, int userId)
    {
        var cacheKey = GetNoteCacheKey(id, userId);
        var cached = await _cacheService.GetAsync<NoteResponseDto>(cacheKey);
        if (cached != null)
        {
            return ServiceResult<NoteResponseDto>.Ok(cached);
        }

        var note = await _noteRepository.GetByIdForUserAsync(id, userId);
        if (note == null)
        {
            return ServiceResult<NoteResponseDto>.Fail("Note not found.");
        }

        var result = MappingHelper.ToNoteDto(note);
        await _cacheService.SetAsync(cacheKey, result, CacheDuration);
        return ServiceResult<NoteResponseDto>.Ok(result);
    }

    public async Task<ServiceResult<NoteResponseDto>> CreateAsync(int userId, CreateNoteDto dto)
    {
        var note = new Note
        {
            Title = dto.Title,
            Description = dto.Description,
            Reminder = dto.Reminder,
            Color = dto.Color,
            ImageUrl = dto.ImageUrl,
            UserId = userId
        };

        await _noteRepository.AddAsync(note);
        await _noteRepository.SaveChangesAsync();

        await UpdateLabelsAsync(note, dto.LabelIds, userId);
        await _noteRepository.SaveChangesAsync();

        var savedNote = await _noteRepository.GetByIdOwnedByUserAsync(note.Id, userId);
        await InvalidateNoteCacheAsync(userId, note.Id);

        return ServiceResult<NoteResponseDto>.Ok(MappingHelper.ToNoteDto(savedNote!), "Note created successfully.");
    }

    public async Task<ServiceResult<NoteResponseDto>> UpdateAsync(int id, int userId, UpdateNoteDto dto)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(id, userId);
        if (note == null)
        {
            return ServiceResult<NoteResponseDto>.Fail("Note not found.");
        }

        if (dto.Title != null)
        {
            note.Title = dto.Title;
        }

        if (dto.Description != null)
        {
            note.Description = dto.Description;
        }

        if (dto.Color != null)
        {
            note.Color = dto.Color;
        }

        if (dto.ImageUrl != null)
        {
            note.ImageUrl = dto.ImageUrl;
        }

        if (dto.IsArchived.HasValue)
        {
            note.IsArchived = dto.IsArchived.Value;
        }

        if (dto.IsPinned.HasValue)
        {
            note.IsPinned = dto.IsPinned.Value;
        }

        note.Reminder = dto.Reminder;
        note.UpdatedAt = DateTime.UtcNow;

        if (dto.LabelIds != null)
        {
            await UpdateLabelsAsync(note, dto.LabelIds, userId);
        }

        await _noteRepository.SaveChangesAsync();
        var savedNote = await _noteRepository.GetByIdOwnedByUserAsync(id, userId);
        await InvalidateNoteCacheAsync(userId, id);

        return ServiceResult<NoteResponseDto>.Ok(MappingHelper.ToNoteDto(savedNote!), "Note updated successfully.");
    }

    public async Task<ServiceResult> DeleteAsync(int id, int userId)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(id, userId);
        if (note == null)
        {
            return ServiceResult.Fail("Note not found.");
        }

        note.IsTrashed = true;
        note.TrashedAt = DateTime.UtcNow;
        note.UpdatedAt = DateTime.UtcNow;
        await _noteRepository.SaveChangesAsync();

        await InvalidateNoteCacheAsync(userId, id);
        return ServiceResult.Ok("Note moved to trash.");
    }

    public async Task<ServiceResult<NoteResponseDto>> ToggleArchiveAsync(int id, int userId, bool isArchived)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(id, userId);
        if (note == null)
        {
            return ServiceResult<NoteResponseDto>.Fail("Note not found.");
        }

        note.IsArchived = isArchived;
        note.UpdatedAt = DateTime.UtcNow;
        await _noteRepository.SaveChangesAsync();
        await InvalidateNoteCacheAsync(userId, id);

        return ServiceResult<NoteResponseDto>.Ok(MappingHelper.ToNoteDto(note), "Archive status updated.");
    }

    public async Task<ServiceResult<NoteResponseDto>> TogglePinAsync(int id, int userId, bool isPinned)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(id, userId);
        if (note == null)
        {
            return ServiceResult<NoteResponseDto>.Fail("Note not found.");
        }

        note.IsPinned = isPinned;
        note.UpdatedAt = DateTime.UtcNow;
        await _noteRepository.SaveChangesAsync();
        await InvalidateNoteCacheAsync(userId, id);

        return ServiceResult<NoteResponseDto>.Ok(MappingHelper.ToNoteDto(note), "Pin status updated.");
    }

    public async Task<ServiceResult<NoteResponseDto>> ToggleTrashAsync(int id, int userId, bool isTrashed)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(id, userId);
        if (note == null)
        {
            return ServiceResult<NoteResponseDto>.Fail("Note not found.");
        }

        note.IsTrashed = isTrashed;
        note.TrashedAt = isTrashed ? DateTime.UtcNow : null;
        note.UpdatedAt = DateTime.UtcNow;
        await _noteRepository.SaveChangesAsync();
        await InvalidateNoteCacheAsync(userId, id);

        return ServiceResult<NoteResponseDto>.Ok(MappingHelper.ToNoteDto(note), "Trash status updated.");
    }

    public async Task<ServiceResult<NoteResponseDto>> RestoreAsync(int id, int userId)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(id, userId);
        if (note == null)
        {
            return ServiceResult<NoteResponseDto>.Fail("Note not found.");
        }

        note.IsTrashed = false;
        note.TrashedAt = null;
        note.UpdatedAt = DateTime.UtcNow;
        await _noteRepository.SaveChangesAsync();
        await InvalidateNoteCacheAsync(userId, id);

        return ServiceResult<NoteResponseDto>.Ok(MappingHelper.ToNoteDto(note), "Note restored successfully.");
    }

    public async Task<ServiceResult> DeletePermanentlyAsync(int id, int userId)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(id, userId);
        if (note == null)
        {
            return ServiceResult.Fail("Note not found.");
        }

        if (!note.IsTrashed)
        {
            return ServiceResult.Fail("Only trashed notes can be permanently deleted.");
        }

        _noteRepository.DeleteMany(new List<Note> { note });
        await _noteRepository.SaveChangesAsync();
        await InvalidateNoteCacheAsync(userId, id);

        return ServiceResult.Ok("Trashed note removed permanently.");
    }

    public async Task<ServiceResult> EmptyTrashAsync(int userId)
    {
        var notes = await _noteRepository.GetAllForUserAsync(userId, new NoteFilterDto { IsTrashed = true });
        _noteRepository.DeleteMany(notes);
        await _noteRepository.SaveChangesAsync();

        return ServiceResult.Ok("Trash emptied successfully.");
    }

    public async Task<ServiceResult<List<NoteResponseDto>>> GetRemindersAsync(int userId, DateTime? fromDate, DateTime? toDate)
    {
        var notes = await _noteRepository.GetAllForUserAsync(userId, new NoteFilterDto());
        var filtered = notes.Where(x => x.Reminder.HasValue).ToList();

        if (fromDate.HasValue)
        {
            filtered = filtered.Where(x => x.Reminder >= fromDate.Value).ToList();
        }

        if (toDate.HasValue)
        {
            filtered = filtered.Where(x => x.Reminder <= toDate.Value).ToList();
        }

        return ServiceResult<List<NoteResponseDto>>.Ok(filtered.Select(MappingHelper.ToNoteDto).ToList());
    }

    private async Task UpdateLabelsAsync(Note note, List<int> labelIds, int userId)
    {
        note.NoteLabels.Clear();
        if (labelIds.Count == 0)
        {
            return;
        }

        var labels = await _labelRepository.GetByIdsForUserAsync(labelIds, userId);
        foreach (var label in labels)
        {
            note.NoteLabels.Add(new NoteLabel
            {
                NoteId = note.Id,
                LabelId = label.Id
            });
        }
    }

    private async Task InvalidateNoteCacheAsync(int userId, int noteId)
    {
        await _cacheService.RemoveAsync(GetNoteCacheKey(noteId, userId));
        await _cacheService.RemoveAsync($"user_labels:{userId}");
    }

    private static string GetNoteCacheKey(int noteId, int userId)
    {
        return $"note:{noteId}:user:{userId}";
    }
}
