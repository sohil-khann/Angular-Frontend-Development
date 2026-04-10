using System.ComponentModel.DataAnnotations;

namespace Fundoo.DTOs.Labels;

public class UpdateLabelDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
}
