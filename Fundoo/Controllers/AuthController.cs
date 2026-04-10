using Fundoo.DTOs.Auth;
using Fundoo.Helpers;
using Fundoo.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fundoo.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ICurrentUserService _currentUserService;

    public AuthController(IAuthService authService, ICurrentUserService currentUserService)
    {
        _authService = authService;
        _currentUserService = currentUserService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto, HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent.ToString());
        return result.Success ? Ok(result.Data) : BadRequest(new { result.Message });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto, HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent.ToString());
        return result.Success ? Ok(result.Data) : BadRequest(new { result.Message });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
    {
        var result = await _authService.ForgotPasswordAsync(dto);
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var result = await _authService.ResetPasswordAsync(dto);
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _authService.ChangePasswordAsync(user.UserId, dto);
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(LogoutDto? dto)
    {
        var user = _currentUserService.GetCurrentUser();
        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _authService.LogoutAsync(user.UserId, user.TokenId, dto ?? new LogoutDto());
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken(RefreshTokenDto dto)
    {
        var result = await _authService.RefreshTokenAsync(dto);
        return result.Success ? Ok(result.Data) : BadRequest(new { result.Message });
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        var result = await _authService.VerifyEmailAsync(token);
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }

    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerification(ForgotPasswordDto dto)
    {
        var result = await _authService.ResendVerificationEmailAsync(dto);
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }
}
