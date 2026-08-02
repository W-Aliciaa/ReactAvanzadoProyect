export type AdDto = {
  id: number;
  title: string;
  description: string;
  price: number;
  tags: string[];
  likes: number;
  createdAt: Date;
  ownerId: number | null;
};
