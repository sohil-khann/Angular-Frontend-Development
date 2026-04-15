# Fundoo Notes - Full Stack Application

A full-stack note-taking application inspired by Google Keep, built with ASP.NET Core 8.0 (backend) and Angular 21 (frontend).

## Architecture

```
Angular-Frontend-Development/
├── Fundoo/                 # ASP.NET Core 8.0 Web API
│   ├── Controllers/        # API endpoints
│   ├── Services/           # Business logic
│   ├── Repositories/       # Data access layer
│   ├── Models/             # Entity models
│   ├── DTOs/               # Data Transfer Objects
│   ├── Data/               # EF Core DbContext
│   ├── Helpers/            # Utilities (JWT, Email, Cache)
│   ├── Middleware/         # Custom middleware
│   ├── Configurations/     # Settings classes
│   ├── Migrations/         # EF Core migrations
│   └── Fundoo.Tests/       # Unit tests
│
└── FundooUI/               # Angular 21 SPA
    ├── src/app/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Route pages
    │   ├── services/       # API services
    │   ├── models/         # TypeScript interfaces
    │   ├── guards/         # Route guards
    │   ├── interceptors/   # HTTP interceptors
    │   └── helpers/        # Utilities
    └── public/             # Static assets
```

## Features

### Backend (ASP.NET Core)
- **Authentication**: JWT-based auth with refresh tokens, email verification, password reset
- **Notes Management**: Create, read, update, delete, archive, pin, trash notes
- **Labels**: Create and manage labels, assign to notes
- **Collaboration**: Invite collaborators to notes
- **Sessions**: Track user sessions, device management
- **Email**: SMTP integration for verification and password reset
- **Logging**: Serilog with console, file, Seq, and MSSqlServer sinks
- **Caching**: Redis for session and data caching
- **API Documentation**: Swagger/Swashbuckle

### Frontend (Angular 21)
- **Authentication**: Login, registration, email verification, password management
- **Notes Board**: Grid/list view of notes with search and filtering
- **Note Editor**: Create and edit notes with title and description
- **Labels**: Create, edit, delete labels and assign to notes
- **Collaboration**: View and manage note collaborators
- **Sessions**: View active sessions, logout from devices
- **Responsive Design**: Mobile-friendly Material-inspired UI
- **Testing**: Vitest unit tests

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend Framework | ASP.NET Core 8.0 |
| Frontend Framework | Angular 21 |
| Database | SQL Server |
| ORM | Entity Framework Core 8.0 |
| Authentication | JWT Bearer tokens |
| Caching | Redis (StackExchange) |
| Logging | Serilog |
| Testing | xUnit (Backend), Vitest (Frontend) |
| Package Manager | npm |

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- SQL Server (local or containerized)
- Redis (optional, for caching)

### Backend Setup

```bash
cd Fundoo

# Restore packages
dotnet restore

# Update appsettings.json with your connection strings

# Run database migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at `https://localhost:7000` (or configured port).

### Frontend Setup

```bash
cd FundooUI

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`.

## API Endpoints

| Controller | Description |
|------------|-------------|
| Auth | Registration, login, refresh token, logout, forgot/reset password, change password |
| Notes | CRUD operations, archive, pin, trash, filter |
| Labels | CRUD operations for labels |
| Collaborators | Invite and remove collaborators |
| Sessions | List, revoke user sessions |

## Configuration

### Backend (appsettings.json)
- `ConnectionStrings:DefaultConnection` - SQL Server connection string
- `JwtSettings` - JWT token configuration (secret, issuer, audience, expiry)
- `SmtpSettings` - Email server configuration
- `FrontendSettings` - CORS allowed origins

### Frontend (environment.ts)
- `apiUrl` - Backend API base URL

# Fundoo Notes API

Fundoo Notes is a beginner-friendly ASP.NET Core 8 Web API for collaborative note taking. The project is written in a layered style so it is easy to follow step by step.

## What this project includes

- User registration and login
- JWT access tokens and refresh tokens
- Forgot password, reset password, change password
- Email verification flow
- Notes with title, description, reminder, color, image, archive, pin, trash, restore
- Labels for organizing notes
- Collaborator invitations for notes
- User session tracking
- Redis caching with a local Redis server
- Serilog logging to console and file
- Swagger documentation
- NUnit test project
- EF Core migrations

## Project structure

- `Controllers`:
  Receives HTTP requests and sends HTTP responses.
- `Services`:
  Contains business logic.
- `Repositories`:
  Talks to Entity Framework Core.
- `Models`:
  Defines the database tables.
- `DTOs`:
  Defines request and response objects.
- `Helpers`:
  Handles JWT, current user info, caching, email logging, and service result objects.
- `Data`:
  Contains the DbContext and design-time factory.
- `Migrations`:
  Contains EF Core migration files.
- `Fundoo.Tests`:
  NUnit test project.

## Technologies used

- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server by default
- JWT Bearer Authentication
- BCrypt.Net-Next
- Redis cache support
- Serilog
- Swagger
- NUnit

## How the application works

### 1. Request flow

1. A request comes to a controller.
2. The controller validates the request and calls a service.
3. The service applies business rules.
4. The service uses a repository to read or write data.
5. The repository uses `FundooDbContext` to talk to the database.
6. The service returns a `ServiceResult`.
7. The controller converts that into an HTTP response.

### 2. Authentication flow

1. A user registers with email and password.
2. The password is hashed with BCrypt.
3. The API creates a JWT access token and a refresh token.
4. A session row is created in `UserSessions`.
5. Protected endpoints read the current user from the JWT claims.

### 3. Notes flow

1. A logged-in user creates a note.
2. The note is stored in the `Notes` table.
3. Labels are linked through the `NoteLabels` table.
4. Archive, pin, trash, restore, and reminder actions update the note state.

### 4. Collaboration flow

1. The note owner invites a collaborator by email.
2. An invitation row is stored in `NoteCollaborators`.
3. The invited user can accept or decline.
4. Accepted collaborators can access the shared note.

### 5. Caching flow

- If a Redis connection string is configured, distributed Redis cache is used.
- If it is empty, the app automatically uses in-memory distributed cache.
- Notes, labels, and sessions are cached for short periods.

## Beginner-friendly design choices

To keep the project easy to learn, the code avoids some advanced patterns.

- DTO mapping is written manually instead of using AutoMapper.
- Repositories and services are plain classes with clear method names.
- The app uses SQL Server by default so it matches the assignment requirement.
- Email sending is currently a fake logging service, so no SMTP setup is required to run the project.

## Database tables

### Users

Stores account information.

Important columns:
- `Id`
- `FirstName`
- `LastName`
- `Email`
- `PasswordHash`
- `PasswordResetToken`
- `RefreshToken`
- `EmailVerificationToken`
- `IsEmailVerified`

### Notes

Stores user notes.

Important columns:
- `Id`
- `Title`
- `Description`
- `Reminder`
- `Color`
- `ImageUrl`
- `IsArchived`
- `IsPinned`
- `IsTrashed`
- `TrashedAt`
- `UserId`

### Labels

Stores user-created labels.

Important columns:
- `Id`
- `Name`
- `Color`
- `UserId`

### NoteLabels

Joins notes and labels.

Important columns:
- `Id`
- `NoteId`
- `LabelId`

### NoteCollaborators

Stores note collaboration invites.

Important columns:
- `Id`
- `NoteId`
- `UserId`
- `CollaboratorEmail`
- `HasAccepted`
- `InvitationSentAt`
- `AcceptedAt`

### UserSessions

Stores active sessions.

Important columns:
- `Id`
- `UserId`
- `SessionToken`
- `RefreshToken`
- `IpAddress`
- `UserAgent`
- `ExpiresAt`
- `IsActive`

## Configuration

The main settings are in `appsettings.json`.

### Connection string

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=SOHIL-KHAN\\SQLEXPRESS;Database=FundooDB;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False;Command Timeout=30"
}
```

### JWT settings

```json
"JwtSettings": {
  "Issuer": "FundooApi",
  "Audience": "FundooUsers",
  "SecretKey": "THIS_IS_A_LONG_DEVELOPMENT_SECRET_KEY_CHANGE_IT",
  "AccessTokenMinutes": 60,
  "RefreshTokenDays": 7
}
```

### Redis settings

```json
"Redis": {
  "ConnectionString": "localhost:6379"
}
```

If `ConnectionString` is empty, in-memory cache is used.

## How to run the project

### Step 1. Restore packages

```powershell
dotnet restore
```

### Step 2. Apply migrations

```powershell
dotnet ef database update
```

### Step 3. Run the API

```powershell
dotnet run
```

### Step 4. Open Swagger

Open the URL shown in the terminal, then go to `/swagger`.

Example:

```text
https://localhost:5001/swagger
```

## EF Core migrations

This project now uses proper EF Core migrations.

### Create a new migration

```powershell
dotnet ef migrations add MigrationName
```

### Apply migrations

```powershell
dotnet ef database update
```

### Remove the last migration

```powershell
dotnet ef migrations remove
```

## Running tests

### Run all tests

```powershell
dotnet test Fundoo.Tests\Fundoo.Tests.csproj
```

### Current test coverage includes

- basic controller tests
- auth service tests
- note service tests
- collaborator service tests

## API endpoints

All protected endpoints require this header:

```text
Authorization: Bearer <token>
```

### Authentication

- `POST /api/auth/register`
  Register a new user.
- `POST /api/auth/login`
  Login and receive access token + refresh token.
- `POST /api/auth/forgot-password`
  Generate a password reset token.
- `POST /api/auth/reset-password`
  Reset password using token.
- `POST /api/auth/change-password`
  Change password for logged-in user.
- `POST /api/auth/logout`
  Logout current session or all sessions.
- `POST /api/auth/refresh-token`
  Generate a new access token using refresh token.
- `GET /api/auth/verify-email?token=...`
  Verify email token.
- `POST /api/auth/resend-verification`
  Generate and send a new verification token.

### Notes

- `GET /api/notes`
  Get notes with optional filters.
- `GET /api/notes/{id}`
  Get one note.
- `POST /api/notes`
  Create a note.
- `PUT /api/notes/{id}`
  Update a note.
- `DELETE /api/notes/{id}`
  Move note to trash.
- `PATCH /api/notes/{id}/archive`
  Archive or unarchive a note.
- `PATCH /api/notes/{id}/pin`
  Pin or unpin a note.
- `PATCH /api/notes/{id}/trash`
  Trash or untrash a note.
- `POST /api/notes/{id}/restore`
  Restore a trashed note.
- `DELETE /api/notes/trash/empty`
  Permanently remove all trashed notes.
- `GET /api/notes/reminders`
  Get notes with reminders.

### Labels

- `GET /api/labels`
  Get all labels for the current user.
- `GET /api/labels/{id}`
  Get one label.
- `POST /api/labels`
  Create a label.
- `PUT /api/labels/{id}`
  Update a label.
- `DELETE /api/labels/{id}`
  Delete a label.
- `GET /api/labels/{id}/notes`
  Get notes for a label.

### Collaborators

- `GET /api/notes/{noteId}/collaborators`
  Get collaborators for a note.
- `POST /api/notes/{noteId}/collaborators/invite`
  Invite a collaborator.
- `DELETE /api/notes/{noteId}/collaborators/{collaboratorId}`
  Remove a collaborator.
- `GET /api/notes/collaborators/invitations/pending`
  Get pending invitations.
- `POST /api/notes/collaborators/invitations/{invitationId}/accept`
  Accept invitation.
- `POST /api/notes/collaborators/invitations/{invitationId}/decline`
  Decline invitation.

### Sessions

- `GET /api/sessions`
  Get active sessions.
- `DELETE /api/sessions/{sessionId}`
  Terminate one session.
- `DELETE /api/sessions/terminate-all`
  Terminate all other sessions.

## Example request bodies

### Register

```json
{
  "firstName": "Asha",
  "lastName": "Patel",
  "email": "asha@mail.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

### Login

```json
{
  "email": "asha@mail.com",
  "password": "Password123"
}
```

### Create note

```json
{
  "title": "Meeting notes",
  "description": "Call client at 4 PM",
  "reminder": "2026-03-20T10:00:00",
  "color": "#FFF8B8",
  "imageUrl": "https://example.com/image.png",
  "labelIds": [1, 2]
}
```

### Create label

```json
{
  "name": "Work",
  "color": "#A7FFEB"
}
```

### Invite collaborator

```json
{
  "collaboratorEmail": "rahul@mail.com",
  "message": "Please check this note"
}
```

## Logging

Serilog is configured to:

- write logs to the console
- write rolling logs to `logs/fundoonotes-.txt`

## Current limitations

These are intentional simplifications to keep the project easy to learn.

- Email sending is mocked through logging.
- Redis expects a local server to be running at `localhost:6379`.
- Tests are focused on beginner-friendly service/controller behavior, not full integration testing.
- AutoMapper is not used.

## Suggested next improvements

- connect a real SMTP email service
- add role-based authorization if needed
- add more integration tests with a test database
- move hardcoded secrets to user secrets or environment variables
- add pagination for note listing

## Useful commands

```powershell
dotnet restore
dotnet build
dotnet test Fundoo.Tests\Fundoo.Tests.csproj
dotnet ef migrations add AddNewField
dotnet ef database update
dotnet run
```


