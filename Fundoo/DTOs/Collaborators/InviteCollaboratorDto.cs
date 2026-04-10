using System.ComponentModel.DataAnnotations;

namespace Fundoo.DTOs.Collaborators;

public class InviteCollaboratorDto
{
    [Required]
    [EmailAddress]
    public string CollaboratorEmail { get; set; } = string.Empty;

    public string? Message { get; set; }
}
