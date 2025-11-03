export class Answer {
  id: string;
  roomId: string;
  userId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: Date;
}
