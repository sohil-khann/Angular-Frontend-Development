export interface LabelModel {
  id: number;
  name: string;
  color: string | null;
  userId: number;
  createdAt: string;
  noteCount: number;
}

export interface CreateLabelRequest {
  name: string;
  color: string | null;
}

export interface UpdateLabelRequest {
  name: string;
  color: string | null;
}
