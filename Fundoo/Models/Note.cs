namespace Fundoo.Models;

public class Note : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? Reminder { get; set; }
    public string Color { get; set; } = "#FFFFFF";
    public string? ImageUrl { get; set; }
    public bool IsArchived { get; set; }
    public bool IsPinned { get; set; }
    public bool IsTrashed { get; set; }
    public DateTime? TrashedAt { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public List<NoteLabel> NoteLabels { get; set; } = new();
    public List<NoteCollaborator> Collaborators { get; set; } = new();
}
