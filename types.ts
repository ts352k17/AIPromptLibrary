export interface Prompt {
  id: string;
  title: string;
  text: string;
  negativeText?: string;
  thumbnail: string | null;
  createdAt: string;
}
