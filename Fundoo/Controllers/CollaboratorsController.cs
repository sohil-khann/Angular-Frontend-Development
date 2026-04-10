using Fundoo.DTOs.Collaborators;
using Fundoo.Helpers;
using Fundoo.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Fundoo.Controllers;

[ApiController]
[Authorize]
public class CollaboratorsController : ControllerBase
{
    private readonly ICollaboratorService _collaboratorService;
    private readonly ICurrentUserService _currentUserService;

    public CollaboratorsController(ICollaboratorService collaboratorService, ICurrentUserService currentUserService)
    {
        _collaboratorService = collaboratorService;
        _currentUserService = currentUserService;
    }

    [HttpGet("api/notes/{noteId:int}/collaborators")]
    public async Task<IActionResult> GetForNote(int noteId)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }
        var result = await _collaboratorService.GetForNoteAsync(noteId, user.UserId);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpPost("api/notes/{noteId:int}/collaborators/invite")]
    public async Task<IActionResult> Invite(int noteId, InviteCollaboratorDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _collaboratorService.InviteAsync(noteId, user.UserId, dto);
        return result.Success ? Ok(result.Data) : BadRequest(new { result.Message });
    }

    [HttpDelete("api/notes/{noteId:int}/collaborators/{collaboratorId:int}")]
    public async Task<IActionResult> Remove(int noteId, int collaboratorId)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _collaboratorService.RemoveAsync(noteId, collaboratorId, user.UserId);
        return result.Success ? Ok("collaborator removed") : NotFound(new { result.Message });
    }

    [HttpGet("api/notes/collaborators/invitations/pending")]
    public async Task<IActionResult> GetPendingInvitations()
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _collaboratorService.GetPendingInvitationsAsync(user.UserId, user.Email);
        return Ok(result.Data);
    }

    [HttpPost("api/notes/collaborators/invitations/{invitationId:int}/accept")]
    public async Task<IActionResult> AcceptInvitation(int invitationId)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _collaboratorService.AcceptInvitationAsync(invitationId, user.UserId, user.Email);
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }

    [HttpPost("api/notes/collaborators/invitations/{invitationId:int}/decline")]
    public async Task<IActionResult> DeclineInvitation(int invitationId)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _collaboratorService.DeclineInvitationAsync(invitationId, user.UserId, user.Email);
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }
}
