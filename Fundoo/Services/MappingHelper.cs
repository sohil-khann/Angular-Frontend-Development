using Fundoo.DTOs.Collaborators;
using Fundoo.DTOs.Labels;
using Fundoo.DTOs.Notes;
using Fundoo.Models;

namespace Fundoo.Services;

public static class MappingHelper
{
    public static LabelDto ToLabelDto(Label label)
    {
        return new LabelDto
        {
            Id = label.Id,
            Name = label.Name,
            Color = label.Color,
            UserId = label.UserId,
            CreatedAt = label.CreatedAt,
            NoteCount = label.NoteLabels.Count(x => !x.IsDeleted)
        };
    }

    public static CollaboratorDto ToCollaboratorDto(NoteCollaborator collaborator)
    {
        return new CollaboratorDto
        {
            Id = collaborator.Id,
            NoteId = collaborator.NoteId,
            NoteTitle = collaborator.Note?.Title ?? string.Empty,
            UserId = collaborator.UserId,
            CollaboratorEmail = collaborator.CollaboratorEmail,
            CollaboratorName = collaborator.User == null ? null : $"{collaborator.User.FirstName} {collaborator.User.LastName}",
            HasAccepted = collaborator.HasAccepted,
            InvitationSentAt = collaborator.InvitationSentAt,
            AcceptedAt = collaborator.AcceptedAt
        };
    }

    public static NoteResponseDto ToNoteDto(Note note)
    {
        return new NoteResponseDto
        {
            Id = note.Id,
            Title = note.Title,
            Description = note.Description,
            Reminder = note.Reminder,
            Color = note.Color,
            ImageUrl = note.ImageUrl,
            IsArchived = note.IsArchived,
            IsPinned = note.IsPinned,
            IsTrashed = note.IsTrashed,
            TrashedAt = note.TrashedAt,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt,
            UserId = note.UserId,
            OwnerName = note.User == null ? string.Empty : $"{note.User.FirstName} {note.User.LastName}",
            Labels = note.NoteLabels.Where(x => !x.IsDeleted && x.Label != null).Select(x => ToLabelDto(x.Label!)).ToList(),
            Collaborators = note.Collaborators.Where(x => !x.IsDeleted).Select(ToCollaboratorDto).ToList()
        };
    }
}
