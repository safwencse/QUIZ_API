import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomParticipantEntity } from '../../../infrastructure/database/entities/room-participant.typeorm-entity';

@Injectable()
export class LeaveRoomUseCase {
  constructor(
    @InjectRepository(RoomParticipantEntity)
    private participantRepository: Repository<RoomParticipantEntity>,
  ) {}

  async execute(roomId: string, userId: string): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { roomId, userId, leftAt: null },
    });

    if (!participant) {
      throw new NotFoundException('You are not in this room');
    }

    participant.leftAt = new Date();
    await this.participantRepository.save(participant);
  }
}
