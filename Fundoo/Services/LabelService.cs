using Fundoo.DTOs.Labels;
using Fundoo.DTOs.Notes;
using Fundoo.Helpers;
using Fundoo.Interfaces.Repositories;
using Fundoo.Interfaces.Services;
using Fundoo.Models;

namespace Fundoo.Services;

public class LabelService : ILabelService
{
    private readonly ILabelRepository _labelRepository;
    private readonly INoteRepository _noteRepository;
    private readonly ICacheService _cacheService;

    public LabelService(ILabelRepository labelRepository, INoteRepository noteRepository, ICacheService cacheService)
    {
        _labelRepository = labelRepository;
        _noteRepository = noteRepository;
        _cacheService = cacheService;
    }

    public async Task<ServiceResult<List<LabelDto>>> GetAllAsync(int userId)
    {
        var cacheKey = $"user_labels:{userId}";
        var cached = await _cacheService.GetAsync<List<LabelDto>>(cacheKey);
        if (cached != null)
        {
            return ServiceResult<List<LabelDto>>.Ok(cached);
        }

        var labels = await _labelRepository.GetAllForUserAsync(userId);
        var result = labels.Select(MappingHelper.ToLabelDto).ToList();

        await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5));
        return ServiceResult<List<LabelDto>>.Ok(result);
    }

    public async Task<ServiceResult<LabelDto>> GetByIdAsync(int id, int userId)
    {
        var label = await _labelRepository.GetByIdForUserAsync(id, userId);
        if (label == null)
        {
            return ServiceResult<LabelDto>.Fail("Label not found.");
        }

        return ServiceResult<LabelDto>.Ok(MappingHelper.ToLabelDto(label));
    }

    public async Task<ServiceResult<LabelDto>> CreateAsync(int userId, CreateLabelDto dto)
    {
        var label = new Label
        {
            Name = dto.Name,
            Color = dto.Color,
            UserId = userId
        };

        await _labelRepository.AddAsync(label);
        await _labelRepository.SaveChangesAsync();
        await _cacheService.RemoveAsync($"user_labels:{userId}");

        return ServiceResult<LabelDto>.Ok(MappingHelper.ToLabelDto(label), "Label created successfully.");
    }

    public async Task<ServiceResult<LabelDto>> UpdateAsync(int id, int userId, UpdateLabelDto dto)
    {
        var label = await _labelRepository.GetByIdForUserAsync(id, userId);
        if (label == null)
        {
            return ServiceResult<LabelDto>.Fail("Label not found.");
        }

        label.Name = dto.Name;
        label.Color = dto.Color;
        label.UpdatedAt = DateTime.UtcNow;
        await _labelRepository.SaveChangesAsync();
        await _cacheService.RemoveAsync($"user_labels:{userId}");

        return ServiceResult<LabelDto>.Ok(MappingHelper.ToLabelDto(label), "Label updated successfully.");
    }

    public async Task<ServiceResult> DeleteAsync(int id, int userId)
    {
        var label = await _labelRepository.GetByIdForUserAsync(id, userId);
        if (label == null)
        {
            return ServiceResult.Fail("Label not found.");
        }

        label.IsDeleted = true;
        label.UpdatedAt = DateTime.UtcNow;
        await _labelRepository.SaveChangesAsync();
        await _cacheService.RemoveAsync($"user_labels:{userId}");

        return ServiceResult.Ok("Label deleted successfully.");
    }

    public async Task<ServiceResult<List<NoteResponseDto>>> GetNotesByLabelAsync(int id, int userId)
    {
        var notes = await _noteRepository.GetAllForUserAsync(userId, new NoteFilterDto { LabelId = id });
        var result = notes.Select(MappingHelper.ToNoteDto).ToList();

        return ServiceResult<List<NoteResponseDto>>.Ok(result);
    }
}
