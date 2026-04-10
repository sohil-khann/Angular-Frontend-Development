using Fundoo.Configurations;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace Fundoo.Helpers;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body);
}

public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtpSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<SmtpSettings> smtpOptions, ILogger<EmailService> logger)
    {
        _smtpSettings = smtpOptions.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        ValidateSettings();
        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            using var smtpClient = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
            {
                EnableSsl = _smtpSettings.EnableSsl,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.AppPassword)
            };

            await smtpClient.SendMailAsync(message);
            _logger.LogInformation("Email sent to {Email}. Subject: {Subject}", toEmail, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email delivery failed for {Email}. Subject: {Subject}", toEmail, subject);
            throw new InvalidOperationException(
                "Email could not be sent. Check your internet connection and SMTP settings, then try again.",
                ex);
        }
    }

    private void ValidateSettings()
    {
        if (string.IsNullOrWhiteSpace(_smtpSettings.Host) ||
            string.IsNullOrWhiteSpace(_smtpSettings.SenderEmail) ||
            string.IsNullOrWhiteSpace(_smtpSettings.AppPassword) ||
            _smtpSettings.Port <= 0)
        {
            throw new InvalidOperationException("SMTP settings are not configured correctly.");
        }
    }
}
