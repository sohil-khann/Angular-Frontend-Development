namespace Fundoo.Models;

public class Label : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public List<NoteLabel> NoteLabels { get; set; } = new();
}
