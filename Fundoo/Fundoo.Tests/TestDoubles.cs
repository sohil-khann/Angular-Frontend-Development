using Fundoo.Helpers;
using Fundoo.Interfaces.Repositories;
using Fundoo.Models;

namespace Fundoo.Tests;

internal class FakeUserRepository : IUserRepository
{
    public List<User> Users { get; } = new();

    public Task AddAsync(User user)
    {
        if (user.Id == 0)
        {
            user.Id = Users.Count + 1;
        }

        Users.Add(user);
        return Task.CompletedTask;
    }

    public Task<User?> GetByEmailAsync(string email)
    {
        return Task.FromResult(Users.FirstOrDefault(x => x.Email == email && !x.IsDeleted));
    }

    public Task<User?> GetByIdAsync(int id)
    {
        return Task.FromResult(Users.FirstOrDefault(x => x.Id == id && !x.IsDeleted));
    }

    public Task<User?> GetByPasswordResetTokenAsync(string token)
    {
        return Task.FromResult(Users.FirstOrDefault(x => x.PasswordResetToken == token && !x.IsDeleted));
    }

    public Task<User?> GetByRefreshTokenAsync(string refreshToken)
    {
        return Task.FromResult(Users.FirstOrDefault(x => x.RefreshToken == refreshToken && !x.IsDeleted));
    }

    public Task<User?> GetByVerificationTokenAsync(string token)
    {
        return Task.FromResult(Users.FirstOrDefault(x => x.EmailVerificationToken == token && !x.IsDeleted));
    }

    public Task SaveChangesAsync()
    {
        return Task.CompletedTask;
    }
}

internal class FakeNoteRepository : INoteRepository
{
    public List<Note> Notes { get; } = new();

    public Task AddAsync(Note note)
    {
        if (note.Id == 0)
        {
            note.Id = Notes.Count + 1;
        }

        Notes.Add(note);
        return Task.CompletedTask;
    }

    public void DeleteMany(List<Note> notes)
    {
        foreach (var note in notes)
        {
            Notes.Remove(note);
        }
    }

    public Task<List<Note>> GetAllForUserAsync(int userId, Fundoo.DTOs.Notes.NoteFilterDto filter)
    {
        IEnumerable<Note> query = Notes.Where(x => x.UserId == userId && !x.IsDeleted);

        if (filter.IsArchived.HasValue)
        {
            query = query.Where(x => x.IsArchived == filter.IsArchived.Value);
        }

        if (filter.IsPinned.HasValue)
        {
            query = query.Where(x => x.IsPinned == filter.IsPinned.Value);
        }

        if (filter.IsTrashed.HasValue)
        {
            query = query.Where(x => x.IsTrashed == filter.IsTrashed.Value);
        }

        if (filter.LabelId.HasValue)
        {
            query = query.Where(x => x.NoteLabels.Any(y => y.LabelId == filter.LabelId.Value && !y.IsDeleted));
        }

        return Task.FromResult(query.ToList());
    }

    public Task<Note?> GetByIdForUserAsync(int id, int userId)
    {
        return Task.FromResult(Notes.FirstOrDefault(x => x.Id == id && !x.IsDeleted && (x.UserId == userId || x.Collaborators.Any(y => y.UserId == userId && y.HasAccepted && !y.IsDeleted))));
    }

    public Task<Note?> GetByIdOwnedByUserAsync(int id, int userId)
    {
        return Task.FromResult(Notes.FirstOrDefault(x => x.Id == id && x.UserId == userId && !x.IsDeleted));
    }

    public Task SaveChangesAsync()
    {
        return Task.CompletedTask;
    }
}

internal class FakeLabelRepository : ILabelRepository
{
    public List<Label> Labels { get; } = new();

    public Task AddAsync(Label label)
    {
        if (label.Id == 0)
        {
            label.Id = Labels.Count + 1;
        }

        Labels.Add(label);
        return Task.CompletedTask;
    }

    public Task<List<Label>> GetAllForUserAsync(int userId)
    {
        return Task.FromResult(Labels.Where(x => x.UserId == userId && !x.IsDeleted).ToList());
    }

    public Task<Label?> GetByIdForUserAsync(int id, int userId)
    {
        return Task.FromResult(Labels.FirstOrDefault(x => x.Id == id && x.UserId == userId && !x.IsDeleted));
    }

    public Task<List<Label>> GetByIdsForUserAsync(List<int> ids, int userId)
    {
        return Task.FromResult(Labels.Where(x => ids.Contains(x.Id) && x.UserId == userId && !x.IsDeleted).ToList());
    }

    public Task SaveChangesAsync()
    {
        return Task.CompletedTask;
    }
}

internal class FakeCollaboratorRepository : ICollaboratorRepository
{
    public List<NoteCollaborator> Collaborators { get; } = new();

    public Task AddAsync(NoteCollaborator collaborator)
    {
        if (collaborator.Id == 0)
        {
            collaborator.Id = Collaborators.Count + 1;
        }

        Collaborators.Add(collaborator);
        return Task.CompletedTask;
    }

    public Task<NoteCollaborator?> GetByIdAsync(int id)
    {
        return Task.FromResult(Collaborators.FirstOrDefault(x => x.Id == id && !x.IsDeleted));
    }

    public Task<List<NoteCollaborator>> GetForNoteAsync(int noteId)
    {
        return Task.FromResult(Collaborators.Where(x => x.NoteId == noteId && !x.IsDeleted).ToList());
    }

    public Task<List<NoteCollaborator>> GetPendingInvitationsAsync(string email)
    {
        return Task.FromResult(Collaborators.Where(x => x.CollaboratorEmail == email && !x.IsDeleted && !x.HasAccepted).ToList());
    }

    public Task SaveChangesAsync()
    {
        return Task.CompletedTask;
    }
}

internal class FakeSessionRepository : ISessionRepository
{
    public List<UserSession> Sessions { get; } = new();

    public Task AddAsync(UserSession session)
    {
        if (session.Id == 0)
        {
            session.Id = Sessions.Count + 1;
        }

        Sessions.Add(session);
        return Task.CompletedTask;
    }

    public Task<List<UserSession>> GetActiveSessionsAsync(int userId)
    {
        return Task.FromResult(Sessions.Where(x => x.UserId == userId && x.IsActive && !x.IsDeleted).ToList());
    }

    public Task<UserSession?> GetByIdAsync(int id)
    {
        return Task.FromResult(Sessions.FirstOrDefault(x => x.Id == id && !x.IsDeleted));
    }

    public Task<UserSession?> GetByRefreshTokenAsync(string refreshToken)
    {
        return Task.FromResult(Sessions.FirstOrDefault(x => x.RefreshToken == refreshToken && !x.IsDeleted));
    }

    public Task SaveChangesAsync()
    {
        return Task.CompletedTask;
    }
}

internal class FakeCacheService : ICacheService
{
    public Dictionary<string, object> Values { get; } = new();

    public Task<T?> GetAsync<T>(string key)
    {
        if (!Values.ContainsKey(key))
        {
            return Task.FromResult(default(T));
        }

        return Task.FromResult((T?)Values[key]);
    }

    public Task RemoveAsync(string key)
    {
        Values.Remove(key);
        return Task.CompletedTask;
    }

    public Task SetAsync<T>(string key, T value, TimeSpan expiration)
    {
        Values[key] = value!;
        return Task.CompletedTask;
    }
}

internal class FakeEmailService : IEmailService
{
    public List<(string ToEmail, string Subject, string Body)> SentEmails { get; } = new();

    public Task SendEmailAsync(string toEmail, string subject, string body)
    {
        SentEmails.Add((toEmail, subject, body));
        return Task.CompletedTask;
    }
}
