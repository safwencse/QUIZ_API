import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerEntity } from '../../../infrastructure/database/entities/answer.typeorm-entity';
import { QuestionEntity } from '../../../infrastructure/database/entities/question.typeorm-entity';
import { RoomParticipantEntity } from '../../../infrastructure/database/entities/room-participant.typeorm-entity';
import { SubmitAnswerDto } from '../../dto/quiz/submit-answer.dto';

@Injectable()
export class SubmitAnswerUseCase {
  constructor(
    @InjectRepository(AnswerEntity)
    private answerRepository: Repository<AnswerEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(RoomParticipantEntity)
    private participantRepository: Repository<RoomParticipantEntity>,
  ) {}

  async execute(roomId: string, userId: string, submitAnswerDto: SubmitAnswerDto) {
    const { questionId, selectedAnswer, timeSpent } = submitAnswerDto;

    const question = await this.questionRepository.findOne({ where: { id: questionId } });
    
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const existingAnswer = await this.answerRepository.findOne({
      where: { roomId, userId, questionId },
    });

    if (existingAnswer) {
      throw new BadRequestException('You have already answered this question');
    }

    const isCorrect = question.correctAnswer === selectedAnswer;
    
    const answer = this.answerRepository.create({
      roomId,
      userId,
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent,
    });

    await this.answerRepository.save(answer);

    if (isCorrect) {
      const participant = await this.participantRepository.findOne({
        where: { roomId, userId, leftAt: null },
      });

      if (participant) {
        const timeBonusMultiplier = Math.max(0, 1 - (timeSpent / question.timeLimit));
        const earnedPoints = Math.round(question.points * (1 + timeBonusMultiplier * 0.5));
        
        participant.score += earnedPoints;
        await this.participantRepository.save(participant);
      }
    }

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
    };
  }
}
