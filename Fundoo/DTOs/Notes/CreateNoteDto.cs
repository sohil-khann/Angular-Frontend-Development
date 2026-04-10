using Fundoo.DTOs.Collaborators;
using Fundoo.DTOs.Labels;
using System.ComponentModel.DataAnnotations;

namespace Fundoo.DTOs.Notes;

public class CreateNoteDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? Reminder { get; set; }
    public string Color { get; set; } = "#FFFFFF";
    public string? ImageUrl { get; set; }
    public List<int> LabelIds { get; set; } = new();
}
