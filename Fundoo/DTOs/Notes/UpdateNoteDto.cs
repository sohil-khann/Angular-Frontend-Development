namespace Fundoo.DTOs.Notes;

public class UpdateNoteDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? Reminder { get; set; }
    public string? Color { get; set; }
    public string? ImageUrl { get; set; }
    public bool? IsArchived { get; set; }
    public bool? IsPinned { get; set; }
    public List<int>? LabelIds { get; set; }
}
