namespace Fundoo.Models;

public class NoteLabel : BaseEntity
{
    public int NoteId { get; set; }
    public int LabelId { get; set; }
    public Note? Note { get; set; }
    public Label? Label { get; set; }
}
