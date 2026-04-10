using Fundoo.DTOs.Collaborators;
using Fundoo.Helpers;

namespace Fundoo.Interfaces.Services;

public interface ICollaboratorService
{
    Task<ServiceResult<List<CollaboratorDto>>> GetForNoteAsync(int noteId, int userId);
    Task<ServiceResult<CollaboratorDto>> InviteAsync(int noteId, int userId, InviteCollaboratorDto dto);
    Task<ServiceResult> RemoveAsync(int noteId, int collaboratorId, int userId);
    Task<ServiceResult<List<CollaboratorDto>>> GetPendingInvitationsAsync(int userId, string email);
    Task<ServiceResult> AcceptInvitationAsync(int invitationId, int userId, string email);
    Task<ServiceResult> DeclineInvitationAsync(int invitationId, int userId, string email);
}
