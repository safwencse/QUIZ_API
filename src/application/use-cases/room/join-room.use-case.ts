import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../../infrastructure/database/entities/room.typeorm-entity';
import { RoomParticipantEntity } from '../../../infrastructure/database/entities/room-participant.typeorm-entity';
import { RoomStatus } from '../../../domain/enums/room-status.enum';

@Injectable()
export class JoinRoomUseCase {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(RoomParticipantEntity)
    private participantRepository: Repository<RoomParticipantEntity>,
  ) {}

  async execute(code: string, userId: string): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({ 
      where: { code },
      relations: ['participants'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== RoomStatus.WAITING) {
      throw new BadRequestException('Room is not accepting new players');
    }

    const activeParticipants = room.participants.filter(p => !p.leftAt);
    
    if (activeParticipants.length >= room.maxPlayers) {
      throw new BadRequestException('Room is full');
    }

    const existingParticipant = await this.participantRepository.findOne({
      where: { roomId: room.id, userId, leftAt: null },
    });

    if (existingParticipant) {
      throw new BadRequestException('You are already in this room');
    }

    const participant = this.participantRepository.create({
      roomId: room.id,
      userId,
    });

    await this.participantRepository.save(participant);

    return await this.roomRepository.findOne({ 
      where: { id: room.id },
      relations: ['participants', 'quiz'],
    });
  }
}
