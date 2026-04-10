using Fundoo.Helpers;
using Fundoo.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundoo.Controllers;

[ApiController]
[Authorize]
[Route("api/sessions")]
public class SessionsController : ControllerBase
{
    private readonly ISessionService _sessionService;
    private readonly ICurrentUserService _currentUserService;

    public SessionsController(ISessionService sessionService, ICurrentUserService currentUserService)
    {
        _sessionService = sessionService;
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

        var result = await _sessionService.GetActiveSessionsAsync(user.UserId, user.TokenId);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Message });
    }

    [HttpDelete("{sessionId:int}")]
    public async Task<IActionResult> Terminate(int sessionId)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _sessionService.TerminateSessionAsync(sessionId, user.UserId);
        return result.Success ? NoContent() : NotFound(new { result.Message });
    }

    [HttpDelete("terminate-all")]
    public async Task<IActionResult> TerminateAll()
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _sessionService.TerminateAllOtherSessionsAsync(user.UserId, user.TokenId);
        return result.Success ? NoContent() : BadRequest(new { result.Message });
    }
}
