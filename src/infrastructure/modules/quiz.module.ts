import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RoomEntity } from '../database/entities/room.typeorm-entity';
import { QuestionEntity } from '../database/entities/question.typeorm-entity';
import { AnswerEntity } from '../database/entities/answer.typeorm-entity';
import { RoomParticipantEntity } from '../database/entities/room-participant.typeorm-entity';
import { QuizController } from '../../presentation/controllers/quiz.controller';
import { QuizGateway } from '../../presentation/gateways/quiz.gateway';
import { StartQuizUseCase } from '../../application/use-cases/quiz/start-quiz.use-case';
import { GetCurrentQuestionUseCase } from '../../application/use-cases/quiz/get-current-question.use-case';
import { SubmitAnswerUseCase } from '../../application/use-cases/quiz/submit-answer.use-case';
import { GetLeaderboardUseCase } from '../../application/use-cases/quiz/get-leaderboard.use-case';
import { WsJwtGuard } from '../guards/ws-jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      QuestionEntity,
      AnswerEntity,
      RoomParticipantEntity,
    ]),
    JwtModule,
    ConfigModule,
  ],
  controllers: [QuizController],
  providers: [
    QuizGateway,
    WsJwtGuard,
    StartQuizUseCase,
    GetCurrentQuestionUseCase,
    SubmitAnswerUseCase,
    GetLeaderboardUseCase,
  ],
})
export class QuizModule {}
