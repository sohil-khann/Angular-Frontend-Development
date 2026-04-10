namespace Fundoo.DTOs.Sessions;

public class UserSessionsDto
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public List<SessionInfoDto> Sessions { get; set; } = new();
    public int ActiveSessionsCount { get; set; }
}
