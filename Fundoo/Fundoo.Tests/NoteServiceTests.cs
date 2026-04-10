using Fundoo.DTOs.Notes;
using Fundoo.Models;
using Fundoo.Services;
using NUnit.Framework;

namespace Fundoo.Tests;

[TestFixture]
public class NoteServiceTests
{
    [Test]
    public async Task CreateAsync_AddsNote_WithLabels()
    {
        var noteRepository = new FakeNoteRepository();
        var labelRepository = new FakeLabelRepository();
        var cacheService = new FakeCacheService();

        labelRepository.Labels.Add(new Label { Id = 1, UserId = 1, Name = "Work" });
        labelRepository.Labels.Add(new Label { Id = 2, UserId = 1, Name = "Ideas" });

        var service = new NoteService(noteRepository, labelRepository, cacheService);

        var result = await service.CreateAsync(1, new CreateNoteDto
        {
            Title = "First note",
            Description = "Hello",
            LabelIds = new List<int> { 1, 2 }
        });

        Assert.That(result.Success, Is.True);
        Assert.That(noteRepository.Notes.Count, Is.EqualTo(1));
        Assert.That(noteRepository.Notes[0].NoteLabels.Count, Is.EqualTo(2));
        Assert.That(result.Data?.Title, Is.EqualTo("First note"));
    }

    [Test]
    public async Task ToggleTrashAsync_SetsTrashFields()
    {
        var noteRepository = new FakeNoteRepository();
        var labelRepository = new FakeLabelRepository();
        var cacheService = new FakeCacheService();
        var note = new Note { Id = 1, UserId = 1, Title = "Demo" };
        noteRepository.Notes.Add(note);

        var service = new NoteService(noteRepository, labelRepository, cacheService);

        var result = await service.ToggleTrashAsync(1, 1, true);

        Assert.That(result.Success, Is.True);
        Assert.That(note.IsTrashed, Is.True);
        Assert.That(note.TrashedAt, Is.Not.Null);
    }

    [Test]
    public async Task GetByIdAsync_WhenCacheHasValue_ReturnsCachedNote()
    {
        var noteRepository = new FakeNoteRepository();
        var labelRepository = new FakeLabelRepository();
        var cacheService = new FakeCacheService();
        cacheService.Values["note:5:user:1"] = new NoteResponseDto
        {
            Id = 5,
            Title = "Cached note"
        };

        var service = new NoteService(noteRepository, labelRepository, cacheService);

        var result = await service.GetByIdAsync(5, 1);

        Assert.That(result.Success, Is.True);
        Assert.That(result.Data?.Title, Is.EqualTo("Cached note"));
    }
}
