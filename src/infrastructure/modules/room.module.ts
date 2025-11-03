import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../database/entities/room.typeorm-entity';
import { RoomParticipantEntity } from '../database/entities/room-participant.typeorm-entity';
import { QuizEntity } from '../database/entities/quiz.typeorm-entity';
import { RoomController } from '../../presentation/controllers/room.controller';
import { CreateRoomUseCase } from '../../application/use-cases/room/create-room.use-case';
import { JoinRoomUseCase } from '../../application/use-cases/room/join-room.use-case';
import { LeaveRoomUseCase } from '../../application/use-cases/room/leave-room.use-case';
import { GetRoomUseCase } from '../../application/use-cases/room/get-room.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      RoomParticipantEntity,
      QuizEntity,
    ]),
  ],
  controllers: [RoomController],
  providers: [
    CreateRoomUseCase,
    JoinRoomUseCase,
    LeaveRoomUseCase,
    GetRoomUseCase,
  ],
})
export class RoomModule {}
