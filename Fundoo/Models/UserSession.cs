namespace Fundoo.Models;

public class UserSession : BaseEntity
{
    public int UserId { get; set; }
    public string SessionToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public User? User { get; set; }
}
