import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../database/entities/user.typeorm-entity';
import { QuizEntity } from '../database/entities/quiz.typeorm-entity';
import { QuestionEntity } from '../database/entities/question.typeorm-entity';
import { RoomEntity } from '../database/entities/room.typeorm-entity';
import { RoomParticipantEntity } from '../database/entities/room-participant.typeorm-entity';
import { AnswerEntity } from '../database/entities/answer.typeorm-entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    UserEntity,
    QuizEntity,
    QuestionEntity,
    RoomEntity,
    RoomParticipantEntity,
    AnswerEntity,
  ],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
