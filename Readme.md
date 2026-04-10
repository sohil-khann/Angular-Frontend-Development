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

## License

MIT