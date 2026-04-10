using System.Security.Claims;

namespace Fundoo.Helpers;

public interface ICurrentUserService
{
    CurrentUserContext? GetCurrentUser();
}

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public CurrentUserContext? GetCurrentUser()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null || user.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        var idText = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idText, out var userId))
        {
            return null;
        }

        return new CurrentUserContext
        {
            UserId = userId,
            Email = user.FindFirstValue(ClaimTypes.Email) ?? string.Empty,
            TokenId = user.FindFirstValue("jti") ?? user.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti) ?? string.Empty
        };
    }
}
