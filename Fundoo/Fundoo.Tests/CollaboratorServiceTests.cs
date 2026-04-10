using Fundoo.DTOs.Collaborators;
using Fundoo.Models;
using Fundoo.Services;
using Microsoft.Extensions.Logging.Abstractions;
using NUnit.Framework;

namespace Fundoo.Tests;

[TestFixture]
public class CollaboratorServiceTests
{
    [Test]
    public async Task InviteAsync_AddsInvitation_WhenOwnerOwnsNote()
    {
        var noteRepository = new FakeNoteRepository();
        var collaboratorRepository = new FakeCollaboratorRepository();
        var userRepository = new FakeUserRepository();
        var emailService = new FakeEmailService();

        noteRepository.Notes.Add(new Note
        {
            Id = 1,
            UserId = 1,
            Title = "Shared note"
        });

        userRepository.Users.Add(new User
        {
            Id = 2,
            FirstName = "Rahul",
            LastName = "Shah",
            Email = "rahul@mail.com"
        });

        var service = new CollaboratorService(
            noteRepository,
            collaboratorRepository,
            userRepository,
            emailService,
            NullLogger<CollaboratorService>.Instance);

        var result = await service.InviteAsync(1, 1, new InviteCollaboratorDto
        {
            CollaboratorEmail = "rahul@mail.com",
            Message = "Please review this note"
        });

        Assert.That(result.Success, Is.True);
        Assert.That(collaboratorRepository.Collaborators.Count, Is.EqualTo(1));
        Assert.That(collaboratorRepository.Collaborators[0].UserId, Is.EqualTo(2));
        Assert.That(emailService.SentEmails.Count, Is.EqualTo(1));
    }

    [Test]
    public async Task AcceptInvitationAsync_MarksInvitationAccepted()
    {
        var noteRepository = new FakeNoteRepository();
        var collaboratorRepository = new FakeCollaboratorRepository();
        var userRepository = new FakeUserRepository();
        var emailService = new FakeEmailService();

        collaboratorRepository.Collaborators.Add(new NoteCollaborator
        {
            Id = 1,
            NoteId = 4,
            CollaboratorEmail = "demo@test.com"
        });

        var service = new CollaboratorService(
            noteRepository,
            collaboratorRepository,
            userRepository,
            emailService,
            NullLogger<CollaboratorService>.Instance);

        var result = await service.AcceptInvitationAsync(1, 7, "demo@test.com");

        Assert.That(result.Success, Is.True);
        Assert.That(collaboratorRepository.Collaborators[0].HasAccepted, Is.True);
        Assert.That(collaboratorRepository.Collaborators[0].UserId, Is.EqualTo(7));
        Assert.That(collaboratorRepository.Collaborators[0].AcceptedAt, Is.Not.Null);
    }

    [Test]
    public async Task GetPendingInvitationsAsync_ReturnsOnlyPendingRows()
    {
        var noteRepository = new FakeNoteRepository();
        var collaboratorRepository = new FakeCollaboratorRepository();
        var userRepository = new FakeUserRepository();
        var emailService = new FakeEmailService();

        collaboratorRepository.Collaborators.Add(new NoteCollaborator { Id = 1, NoteId = 1, CollaboratorEmail = "demo@test.com", HasAccepted = false });
        collaboratorRepository.Collaborators.Add(new NoteCollaborator { Id = 2, NoteId = 2, CollaboratorEmail = "demo@test.com", HasAccepted = true });

        var service = new CollaboratorService(
            noteRepository,
            collaboratorRepository,
            userRepository,
            emailService,
            NullLogger<CollaboratorService>.Instance);

        var result = await service.GetPendingInvitationsAsync(1, "demo@test.com");

        Assert.That(result.Success, Is.True);
        Assert.That(result.Data?.Count, Is.EqualTo(1));
        Assert.That(result.Data?[0].Id, Is.EqualTo(1));
    }
}
