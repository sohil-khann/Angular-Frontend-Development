using System.ComponentModel.DataAnnotations;

namespace Fundoo.DTOs.Auth;

public class RefreshTokenDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
