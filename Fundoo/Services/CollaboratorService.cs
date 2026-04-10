using Fundoo.DTOs.Collaborators;
using Fundoo.Helpers;
using Fundoo.Interfaces.Repositories;
using Fundoo.Interfaces.Services;
using Fundoo.Models;

namespace Fundoo.Services;

public class CollaboratorService : ICollaboratorService
{
    private readonly INoteRepository _noteRepository;
    private readonly ICollaboratorRepository _collaboratorRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<CollaboratorService> _logger;

    public CollaboratorService(
        INoteRepository noteRepository,
        ICollaboratorRepository collaboratorRepository,
        IUserRepository userRepository,
        IEmailService emailService,
        ILogger<CollaboratorService> logger)
    {
        _noteRepository = noteRepository;
        _collaboratorRepository = collaboratorRepository;
        _userRepository = userRepository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<ServiceResult<List<CollaboratorDto>>> GetForNoteAsync(int noteId, int userId)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(noteId, userId);
        if (note == null)
        {
            return ServiceResult<List<CollaboratorDto>>.Fail("Note not found.");
        }

        var collaborators = await _collaboratorRepository.GetForNoteAsync(noteId);
        return ServiceResult<List<CollaboratorDto>>.Ok(collaborators.Select(MappingHelper.ToCollaboratorDto).ToList());
    }

    public async Task<ServiceResult<CollaboratorDto>> InviteAsync(int noteId, int userId, InviteCollaboratorDto dto)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(noteId, userId);
        if (note == null)
        {
            return ServiceResult<CollaboratorDto>.Fail("Note not found.");
        }

        var existingCollaborators = await _collaboratorRepository.GetForNoteAsync(noteId);
        var email = dto.CollaboratorEmail.Trim().ToLower();

        if (existingCollaborators.Any(x => x.CollaboratorEmail == email && !x.IsDeleted))
        {
            return ServiceResult<CollaboratorDto>.Fail("Collaborator is already invited.");
        }

        var existingUser = await _userRepository.GetByEmailAsync(email);
        var collaborator = new NoteCollaborator
        {
            NoteId = noteId,
            UserId = existingUser?.Id,
            CollaboratorEmail = email
        };

        await _collaboratorRepository.AddAsync(collaborator);
        await _collaboratorRepository.SaveChangesAsync();

        collaborator.Note = note;
        collaborator.User = existingUser;

        try
        {
            await _emailService.SendEmailAsync(
                email,
                "Fundoo collaboration invite",
                dto.Message ?? $"You have been invited to note '{note.Title}'.");
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Collaborator invite email could not be sent for note {NoteId}.", noteId);
        }

        return ServiceResult<CollaboratorDto>.Ok(MappingHelper.ToCollaboratorDto(collaborator), "Invitation sent successfully.");
    }

    public async Task<ServiceResult> RemoveAsync(int noteId, int collaboratorId, int userId)
    {
        var note = await _noteRepository.GetByIdOwnedByUserAsync(noteId, userId);
        if (note == null)
        {
            return ServiceResult.Fail("Note not found.");
        }

        var collaborator = await _collaboratorRepository.GetByIdAsync(collaboratorId);
        if (collaborator == null || collaborator.NoteId != noteId)
        {
            return ServiceResult.Fail("Collaborator not found.");
        }

        collaborator.IsDeleted = true;
        collaborator.UpdatedAt = DateTime.UtcNow;
        await _collaboratorRepository.SaveChangesAsync();

        return ServiceResult.Ok("Collaborator removed successfully.");
    }

    public async Task<ServiceResult<List<CollaboratorDto>>> GetPendingInvitationsAsync(int userId, string email)
    {
        var invitations = await _collaboratorRepository.GetPendingInvitationsAsync(email);
        return ServiceResult<List<CollaboratorDto>>.Ok(invitations.Select(MappingHelper.ToCollaboratorDto).ToList());
    }

    public async Task<ServiceResult> AcceptInvitationAsync(int invitationId, int userId, string email)
    {
        var invitation = await _collaboratorRepository.GetByIdAsync(invitationId);
        if (invitation == null || invitation.CollaboratorEmail != email)
        {
            return ServiceResult.Fail("Invitation not found.");
        }

        invitation.HasAccepted = true;
        invitation.UserId = userId;
        invitation.AcceptedAt = DateTime.UtcNow;
        invitation.UpdatedAt = DateTime.UtcNow;
        await _collaboratorRepository.SaveChangesAsync();

        return ServiceResult.Ok("Invitation accepted.");
    }

    public async Task<ServiceResult> DeclineInvitationAsync(int invitationId, int userId, string email)
    {
        var invitation = await _collaboratorRepository.GetByIdAsync(invitationId);
        if (invitation == null || invitation.CollaboratorEmail != email)
        {
            return ServiceResult.Fail("Invitation not found.");
        }

        invitation.IsDeleted = true;
        invitation.UpdatedAt = DateTime.UtcNow;
        await _collaboratorRepository.SaveChangesAsync();

        return ServiceResult.Ok("Invitation declined.");
    }
}
