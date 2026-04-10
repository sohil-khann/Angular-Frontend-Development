using Fundoo.DTOs.Notes;
using Fundoo.Helpers;
using Fundoo.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundoo.Controllers;

[ApiController]
[Authorize]
[Route("api/notes")]
public class NotesController : ControllerBase
{
    private readonly INoteService _noteService;
    private readonly ICurrentUserService _currentUserService;

    public NotesController(INoteService noteService, ICurrentUserService currentUserService)
    {
        _noteService = noteService;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] NoteFilterDto filter)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.GetAllAsync(user.UserId, filter);
        return Ok(result.Data);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.GetByIdAsync(id, user.UserId);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateNoteDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.CreateAsync(user.UserId, dto);
        return result.Success ? Ok(result.Data) : BadRequest(new { result.Message });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateNoteDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.UpdateAsync(id, user.UserId, dto);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.DeleteAsync(id, user.UserId);
        return result.Success ? Ok("Note moved to trash") : NotFound(new { result.Message });
    }

    [HttpDelete("{id:int}/permanent")]
    public async Task<IActionResult> DeletePermanently(int id)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.DeletePermanentlyAsync(id, user.UserId);
        return result.Success ? Ok("trashed note removed permanently") : BadRequest(new { result.Message });
    }

    [HttpPatch("{id:int}/archive")]
    public async Task<IActionResult> Archive(int id, ArchiveNoteDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.ToggleArchiveAsync(id, user.UserId, dto.IsArchived);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpPatch("{id:int}/pin")]
    public async Task<IActionResult> Pin(int id, PinNoteDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.TogglePinAsync(id, user.UserId, dto.IsPinned);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpPatch("{id:int}/trash")]
    public async Task<IActionResult> Trash(int id, TrashNoteDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.ToggleTrashAsync(id, user.UserId, dto.IsTrashed);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpPost("{id:int}/restore")]
    public async Task<IActionResult> Restore(int id)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.RestoreAsync(id, user.UserId);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpDelete("trash/empty")]
    public async Task<IActionResult> EmptyTrash()
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.EmptyTrashAsync(user.UserId);
        return result.Success ? Ok("trashed notes removed permanently") : BadRequest(new { result.Message });
    }

    [HttpGet("reminders")]
    public async Task<IActionResult> GetReminders([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _noteService.GetRemindersAsync(user.UserId, fromDate, toDate);
        return Ok(result.Data);
    }
}
