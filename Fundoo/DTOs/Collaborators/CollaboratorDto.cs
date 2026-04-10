namespace Fundoo.DTOs.Collaborators;

public class CollaboratorDto
{
    public int Id { get; set; }
    public int NoteId { get; set; }
    public string NoteTitle { get; set; } = string.Empty;
    public int? UserId { get; set; }
    public string CollaboratorEmail { get; set; } = string.Empty;
    public string? CollaboratorName { get; set; }
    public bool HasAccepted { get; set; }
    public DateTime InvitationSentAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
}
