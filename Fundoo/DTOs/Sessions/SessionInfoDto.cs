namespace Fundoo.DTOs.Sessions;

public class SessionInfoDto
{
    public int SessionId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsCurrentSession { get; set; }
    public bool IsActive { get; set; }
}
