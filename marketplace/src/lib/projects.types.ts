export type ProjectDto = {
  id: number;
  title: string;
  description: string;
  likes: number;
  createdAt: Date;
  ownerId: number | null;
};
