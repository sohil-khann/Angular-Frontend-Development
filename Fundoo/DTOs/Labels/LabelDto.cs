namespace Fundoo.DTOs.Labels;

public class LabelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int NoteCount { get; set; }
}
