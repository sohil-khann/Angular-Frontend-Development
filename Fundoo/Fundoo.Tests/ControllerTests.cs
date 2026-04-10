using Fundoo.Controllers;
using Fundoo.DTOs.Auth;
using Fundoo.DTOs.Collaborators;
using Fundoo.DTOs.Labels;
using Fundoo.DTOs.Notes;
using Fundoo.DTOs.Sessions;
using Fundoo.Helpers;
using Fundoo.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace Fundoo.Tests;

[TestFixture]
public class ControllerTests
{
    [Test]
    public async Task AuthController_Register_ReturnsOk()
    {
        var controller = new AuthController(new FakeAuthService(), new FakeCurrentUserService());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.Request.Headers.UserAgent = "nunit";

        var result = await controller.Register(new RegisterDto
        {
            FirstName = "Sohil",
            LastName = "Khan",
            Email = "sohil@mail.com",
            Password = "Password123",
            ConfirmPassword = "Password123"
        });

        Assert.That(result, Is.TypeOf<OkObjectResult>());
    }

    [Test]
    public async Task AuthController_ChangePassword_WithoutUser_ReturnsUnauthorized()
    {
        var controller = new AuthController(new FakeAuthService(), new EmptyCurrentUserService());

        var result = await controller.ChangePassword(new ChangePasswordDto
        {
            CurrentPassword = "old",
            NewPassword = "new12345",
            ConfirmPassword = "new12345"
        });

        Assert.That(result, Is.TypeOf<UnauthorizedResult>());
    }

    [Test]
    public async Task NotesController_GetAll_ReturnsOkResult()
    {
        var controller = new NotesController(new FakeNoteService(), new FakeCurrentUserService());

        var result = await controller.GetAll(new NoteFilterDto());

        Assert.That(result, Is.TypeOf<OkObjectResult>());
    }

    [Test]
    public async Task NotesController_Create_WithoutUser_ReturnsUnauthorized()
    {
        var controller = new NotesController(new FakeNoteService(), new EmptyCurrentUserService());

        var result = await controller.Create(new CreateNoteDto { Title = "Demo" });

        Assert.That(result, Is.TypeOf<UnauthorizedResult>());
    }

    [Test]
    public async Task LabelsController_GetAll_ReturnsOkResult()
    {
        var controller = new LabelsController(new FakeLabelService(), new FakeCurrentUserService());

        var result = await controller.GetAll();

        Assert.That(result, Is.TypeOf<OkObjectResult>());
    }

    [Test]
    public async Task CollaboratorsController_GetPendingInvitations_ReturnsOk()
    {
        var controller = new CollaboratorsController(new FakeCollaboratorService(), new FakeCurrentUserService());

        var result = await controller.GetPendingInvitations();

        Assert.That(result, Is.TypeOf<OkObjectResult>());
    }

    [Test]
    public async Task SessionsController_GetAll_ReturnsOk()
    {
        var controller = new SessionsController(new FakeSessionService(), new FakeCurrentUserService());

        var result = await controller.GetAll();

        Assert.That(result, Is.TypeOf<OkObjectResult>());
    }

    private class FakeCurrentUserService : ICurrentUserService
    {
        public CurrentUserContext? GetCurrentUser()
        {
            return new CurrentUserContext
            {
                UserId = 1,
                Email = "demo@test.com",
                TokenId = "token-id"
            };
        }
    }

    private class EmptyCurrentUserService : ICurrentUserService
    {
        public CurrentUserContext? GetCurrentUser()
        {
            return null;
        }
    }

    private class FakeAuthService : IAuthService
    {
        public Task<ServiceResult> ChangePasswordAsync(int userId, ChangePasswordDto dto) => Task.FromResult(ServiceResult.Ok("changed"));
        public Task<ServiceResult> ForgotPasswordAsync(ForgotPasswordDto dto) => Task.FromResult(ServiceResult.Ok("forgot"));
        public Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto, string? ipAddress, string? userAgent) => Task.FromResult(ServiceResult<AuthResponseDto>.Ok(new AuthResponseDto()));
        public Task<ServiceResult> LogoutAsync(int userId, string tokenId, LogoutDto dto) => Task.FromResult(ServiceResult.Ok("logout"));
        public Task<ServiceResult<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto dto) => Task.FromResult(ServiceResult<AuthResponseDto>.Ok(new AuthResponseDto()));
        public Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto, string? ipAddress, string? userAgent) => Task.FromResult(ServiceResult<AuthResponseDto>.Ok(new AuthResponseDto()));
        public Task<ServiceResult> ResendVerificationEmailAsync(ForgotPasswordDto dto) => Task.FromResult(ServiceResult.Ok("resent"));
        public Task<ServiceResult> ResetPasswordAsync(ResetPasswordDto dto) => Task.FromResult(ServiceResult.Ok("reset"));
        public Task<ServiceResult> VerifyEmailAsync(string token) => Task.FromResult(ServiceResult.Ok("verified"));
    }

    private class FakeNoteService : INoteService
    {
        public Task<ServiceResult<NoteResponseDto>> CreateAsync(int userId, CreateNoteDto dto) => Task.FromResult(ServiceResult<NoteResponseDto>.Ok(new NoteResponseDto()));
        public Task<ServiceResult> DeleteAsync(int id, int userId) => Task.FromResult(ServiceResult.Ok("deleted"));
        public Task<ServiceResult> DeletePermanentlyAsync(int id, int userId) => Task.FromResult(ServiceResult.Ok("deleted"));
        public Task<ServiceResult> EmptyTrashAsync(int userId) => Task.FromResult(ServiceResult.Ok("emptied"));
        public Task<ServiceResult<List<NoteResponseDto>>> GetAllAsync(int userId, NoteFilterDto filter) => Task.FromResult(ServiceResult<List<NoteResponseDto>>.Ok(new List<NoteResponseDto>()));
        public Task<ServiceResult<NoteResponseDto>> GetByIdAsync(int id, int userId) => Task.FromResult(ServiceResult<NoteResponseDto>.Ok(new NoteResponseDto()));
        public Task<ServiceResult<List<NoteResponseDto>>> GetRemindersAsync(int userId, DateTime? fromDate, DateTime? toDate) => Task.FromResult(ServiceResult<List<NoteResponseDto>>.Ok(new List<NoteResponseDto>()));
        public Task<ServiceResult<NoteResponseDto>> RestoreAsync(int id, int userId) => Task.FromResult(ServiceResult<NoteResponseDto>.Ok(new NoteResponseDto()));
        public Task<ServiceResult<NoteResponseDto>> ToggleArchiveAsync(int id, int userId, bool isArchived) => Task.FromResult(ServiceResult<NoteResponseDto>.Ok(new NoteResponseDto()));
        public Task<ServiceResult<NoteResponseDto>> TogglePinAsync(int id, int userId, bool isPinned) => Task.FromResult(ServiceResult<NoteResponseDto>.Ok(new NoteResponseDto()));
        public Task<ServiceResult<NoteResponseDto>> ToggleTrashAsync(int id, int userId, bool isTrashed) => Task.FromResult(ServiceResult<NoteResponseDto>.Ok(new NoteResponseDto()));
        public Task<ServiceResult<NoteResponseDto>> UpdateAsync(int id, int userId, UpdateNoteDto dto) => Task.FromResult(ServiceResult<NoteResponseDto>.Ok(new NoteResponseDto()));
    }

    private class FakeLabelService : ILabelService
    {
        public Task<ServiceResult<LabelDto>> CreateAsync(int userId, CreateLabelDto dto) => Task.FromResult(ServiceResult<LabelDto>.Ok(new LabelDto()));
        public Task<ServiceResult> DeleteAsync(int id, int userId) => Task.FromResult(ServiceResult.Ok("deleted"));
        public Task<ServiceResult<List<LabelDto>>> GetAllAsync(int userId) => Task.FromResult(ServiceResult<List<LabelDto>>.Ok(new List<LabelDto>()));
        public Task<ServiceResult<LabelDto>> GetByIdAsync(int id, int userId) => Task.FromResult(ServiceResult<LabelDto>.Ok(new LabelDto()));
        public Task<ServiceResult<List<NoteResponseDto>>> GetNotesByLabelAsync(int id, int userId) => Task.FromResult(ServiceResult<List<NoteResponseDto>>.Ok(new List<NoteResponseDto>()));
        public Task<ServiceResult<LabelDto>> UpdateAsync(int id, int userId, UpdateLabelDto dto) => Task.FromResult(ServiceResult<LabelDto>.Ok(new LabelDto()));
    }

    private class FakeCollaboratorService : ICollaboratorService
    {
        public Task<ServiceResult> AcceptInvitationAsync(int invitationId, int userId, string email) => Task.FromResult(ServiceResult.Ok("accepted"));
        public Task<ServiceResult> DeclineInvitationAsync(int invitationId, int userId, string email) => Task.FromResult(ServiceResult.Ok("declined"));
        public Task<ServiceResult<List<CollaboratorDto>>> GetForNoteAsync(int noteId, int userId) => Task.FromResult(ServiceResult<List<CollaboratorDto>>.Ok(new List<CollaboratorDto>()));
        public Task<ServiceResult<List<CollaboratorDto>>> GetPendingInvitationsAsync(int userId, string email) => Task.FromResult(ServiceResult<List<CollaboratorDto>>.Ok(new List<CollaboratorDto>()));
        public Task<ServiceResult<CollaboratorDto>> InviteAsync(int noteId, int userId, InviteCollaboratorDto dto) => Task.FromResult(ServiceResult<CollaboratorDto>.Ok(new CollaboratorDto()));
        public Task<ServiceResult> RemoveAsync(int noteId, int collaboratorId, int userId) => Task.FromResult(ServiceResult.Ok("removed"));
    }

    private class FakeSessionService : ISessionService
    {
        public Task<ServiceResult<UserSessionsDto>> GetActiveSessionsAsync(int userId, string currentTokenId) => Task.FromResult(ServiceResult<UserSessionsDto>.Ok(new UserSessionsDto()));
        public Task<ServiceResult> TerminateAllOtherSessionsAsync(int userId, string currentTokenId) => Task.FromResult(ServiceResult.Ok("terminated"));
        public Task<ServiceResult> TerminateSessionAsync(int sessionId, int userId) => Task.FromResult(ServiceResult.Ok("terminated"));
    }
}
