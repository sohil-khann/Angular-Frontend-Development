export interface CollaboratorModel {
  id: number;
  noteId: number;
  noteTitle: string;
  userId: number | null;
  collaboratorEmail: string;
  collaboratorName: string | null;
  hasAccepted: boolean;
  invitationSentAt: string;
  acceptedAt: string | null;
}

export interface InviteCollaboratorRequest {
  collaboratorEmail: string;
  message: string | null;
}
