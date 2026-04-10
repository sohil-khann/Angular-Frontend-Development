import { CollaboratorModel } from './collaborator.models';
import { LabelModel } from './label.models';

export interface NoteModel {
  id: number;
  title: string;
  description: string;
  reminder: string | null;
  color: string;
  imageUrl: string | null;
  isArchived: boolean;
  isPinned: boolean;
  isTrashed: boolean;
  trashedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  ownerName: string;
  labels: LabelModel[];
  collaborators: CollaboratorModel[];
}

export interface CreateNoteRequest {
  title: string;
  description: string;
  reminder: string | null;
  color: string;
  imageUrl: string | null;
  labelIds: number[];
}

export interface CreateNotePayload {
  note: CreateNoteRequest;
  isPinned: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  description?: string;
  reminder?: string | null;
  color?: string | null;
  imageUrl?: string | null;
  isArchived?: boolean | null;
  isPinned?: boolean | null;
  labelIds?: number[] | null;
}

export interface NoteFilterRequest {
  isArchived?: boolean | null;
  isPinned?: boolean | null;
  isTrashed?: boolean | null;
  labelId?: number | null;
}

export type NoteCollectionView = 'notes' | 'reminders' | 'archive' | 'trash' | 'label';
