using Fundoo.Configurations;
using Fundoo.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Fundoo.Helpers;

public interface IJwtTokenHelper
{
    (string token, DateTime expiresAt, string tokenId) GenerateAccessToken(User user);
    string GenerateRefreshToken();
}

public class JwtTokenHelper : IJwtTokenHelper
{
    private readonly JwtSettings _settings;

    public JwtTokenHelper(IOptions<JwtSettings> options)
    {
        _settings = options.Value;
    }

    public (string token, DateTime expiresAt, string tokenId) GenerateAccessToken(User user)
    {
        var tokenId = Guid.NewGuid().ToString();
        var expiresAt = DateTime.UtcNow.AddMinutes(_settings.AccessTokenMinutes);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, tokenId),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt, tokenId);
    }

    public string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
    }
}
