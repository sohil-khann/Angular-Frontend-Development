using Fundoo.Models;
using Microsoft.EntityFrameworkCore;

namespace Fundoo.Data;

public class FundooDbContext : DbContext
{
    public FundooDbContext(DbContextOptions<FundooDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Note> Notes => Set<Note>();
    public DbSet<Label> Labels => Set<Label>();
    public DbSet<NoteLabel> NoteLabels => Set<NoteLabel>();
    public DbSet<NoteCollaborator> NoteCollaborators => Set<NoteCollaborator>();
    public DbSet<UserSession> UserSessions => Set<UserSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<NoteLabel>().HasIndex(x => new { x.NoteId, x.LabelId }).IsUnique();
        modelBuilder.Entity<NoteCollaborator>().HasIndex(x => new { x.NoteId, x.CollaboratorEmail }).IsUnique();

        modelBuilder.Entity<Note>()
            .HasOne(x => x.User)
            .WithMany(x => x.Notes)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Label>()
            .HasOne(x => x.User)
            .WithMany(x => x.Labels)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<NoteLabel>()
            .HasOne(x => x.Note)
            .WithMany(x => x.NoteLabels)
            .HasForeignKey(x => x.NoteId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NoteLabel>()
            .HasOne(x => x.Label)
            .WithMany(x => x.NoteLabels)
            .HasForeignKey(x => x.LabelId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NoteCollaborator>()
            .HasOne(x => x.Note)
            .WithMany(x => x.Collaborators)
            .HasForeignKey(x => x.NoteId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NoteCollaborator>()
            .HasOne(x => x.User)
            .WithMany(x => x.Collaborations)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserSession>()
            .HasOne(x => x.User)
            .WithMany(x => x.Sessions)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
