namespace Fundoo.DTOs.Notes;

public class NoteFilterDto
{
    public bool? IsArchived { get; set; }
    public bool? IsPinned { get; set; }
    public bool? IsTrashed { get; set; }
    public int? LabelId { get; set; }
}
