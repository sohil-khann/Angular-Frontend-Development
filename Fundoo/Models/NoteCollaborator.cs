namespace Fundoo.Models;

public class NoteCollaborator : BaseEntity
{
    public int NoteId { get; set; }
    public int? UserId { get; set; }
    public string CollaboratorEmail { get; set; } = string.Empty;
    public bool HasAccepted { get; set; }
    public DateTime InvitationSentAt { get; set; } = DateTime.UtcNow;
    public DateTime? AcceptedAt { get; set; }
    public Note? Note { get; set; }
    public User? User { get; set; }
}
