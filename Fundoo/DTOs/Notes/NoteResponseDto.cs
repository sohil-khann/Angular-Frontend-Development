using Fundoo.DTOs.Collaborators;
using Fundoo.DTOs.Labels;

namespace Fundoo.DTOs.Notes;

public class NoteResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? Reminder { get; set; }
    public string Color { get; set; } = "#FFFFFF";
    public string? ImageUrl { get; set; }
    public bool IsArchived { get; set; }
    public bool IsPinned { get; set; }
    public bool IsTrashed { get; set; }
    public DateTime? TrashedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int UserId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public List<LabelDto> Labels { get; set; } = new();
    public List<CollaboratorDto> Collaborators { get; set; } = new();
}
