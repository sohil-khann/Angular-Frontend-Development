namespace Fundoo.Configurations;

public class JwtSettings
{
    public string Issuer { get; set; } = "Fundoo";
    public string Audience { get; set; } = "FundooUsers";
    public string SecretKey { get; set; } = "THIS_IS_ONLY_FOR_DEVELOPMENT_CHANGE";
    public int AccessTokenMinutes { get; set; } = 60;
    public int RefreshTokenDays { get; set; } = 7;
}
