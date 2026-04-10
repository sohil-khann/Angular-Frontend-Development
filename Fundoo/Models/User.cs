namespace Fundoo.Models;

public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiry { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    public string? EmailVerificationToken { get; set; }
    public bool IsEmailVerified { get; set; }
    public List<Note> Notes { get; set; } = new();
    public List<Label> Labels { get; set; } = new();
    public List<UserSession> Sessions { get; set; } = new();
    public List<NoteCollaborator> Collaborations { get; set; } = new();
}
