namespace Fundoo.Helpers;

public class CurrentUserContext
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string TokenId { get; set; } = string.Empty;
}
