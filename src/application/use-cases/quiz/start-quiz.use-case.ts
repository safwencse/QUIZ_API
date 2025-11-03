import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../../infrastructure/database/entities/room.typeorm-entity';
import { RoomStatus } from '../../../domain/enums/room-status.enum';

@Injectable()
export class StartQuizUseCase {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}

  async execute(roomId: string, userId: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['host', 'participants'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.hostId !== userId) {
      throw new BadRequestException('Only the host can start the quiz');
    }

    if (room.status !== RoomStatus.WAITING) {
      throw new BadRequestException('Quiz already started');
    }

    room.status = RoomStatus.ACTIVE;
    room.currentQuestionIndex = 0;

    return await this.roomRepository.save(room);
  }
}
