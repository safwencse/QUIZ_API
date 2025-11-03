import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../../infrastructure/database/entities/room.typeorm-entity';

@Injectable()
export class GetRoomUseCase {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}

  async execute(roomId: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['participants', 'participants.user', 'quiz', 'host'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }
}
