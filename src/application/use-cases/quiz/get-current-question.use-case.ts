import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../../infrastructure/database/entities/room.typeorm-entity';
import { QuestionEntity } from '../../../infrastructure/database/entities/question.typeorm-entity';
import { RoomStatus } from '../../../domain/enums/room-status.enum';

@Injectable()
export class GetCurrentQuestionUseCase {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
  ) {}

  async execute(roomId: string) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== RoomStatus.ACTIVE) {
      throw new BadRequestException('Quiz is not active');
    }

    const questions = await this.questionRepository.find({
      where: { quizId: room.quizId },
      order: { order: 'ASC' },
    });

    if (room.currentQuestionIndex >= questions.length) {
      room.status = RoomStatus.FINISHED;
      await this.roomRepository.save(room);
      return null;
    }

    const currentQuestion = questions[room.currentQuestionIndex];
    
    return {
      id: currentQuestion.id,
      questionText: currentQuestion.questionText,
      options: currentQuestion.options,
      timeLimit: currentQuestion.timeLimit,
      points: currentQuestion.points,
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: questions.length,
    };
  }
}
