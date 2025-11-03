export class Question {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
