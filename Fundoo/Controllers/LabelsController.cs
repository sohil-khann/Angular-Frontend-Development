using Fundoo.DTOs.Labels;
using Fundoo.Helpers;
using Fundoo.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundoo.Controllers;

[ApiController]
[Authorize]
[Route("api/labels")]
public class LabelsController : ControllerBase
{
    private readonly ILabelService _labelService;
    private readonly ICurrentUserService _currentUserService;

    public LabelsController(ILabelService labelService, ICurrentUserService currentUserService)
    {
        _labelService = labelService;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _labelService.GetAllAsync(user.UserId);
        return Ok(result.Data);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _labelService.GetByIdAsync(id, user.UserId);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateLabelDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _labelService.CreateAsync(user.UserId, dto);
        return result.Success ? Ok(result.Data) : BadRequest(new { result.Message });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateLabelDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _labelService.UpdateAsync(id, user.UserId, dto);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _labelService.DeleteAsync(id, user.UserId);
        return result.Success ? NoContent() : NotFound(new { result.Message });
    }

    [HttpGet("{id:int}/notes")]
    public async Task<IActionResult> GetNotesByLabel(int id)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _labelService.GetNotesByLabelAsync(id, user.UserId);
        return Ok(result.Data);
    }
}
