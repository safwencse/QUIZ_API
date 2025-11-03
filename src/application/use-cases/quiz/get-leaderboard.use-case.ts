import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomParticipantEntity } from '../../../infrastructure/database/entities/room-participant.typeorm-entity';

@Injectable()
export class GetLeaderboardUseCase {
  constructor(
    @InjectRepository(RoomParticipantEntity)
    private participantRepository: Repository<RoomParticipantEntity>,
  ) {}

  async execute(roomId: string) {
    const participants = await this.participantRepository.find({
      where: { roomId, leftAt: null },
      relations: ['user'],
      order: { score: 'DESC' },
    });

    return participants.map((p, index) => ({
      rank: index + 1,
      userId: p.userId,
      username: p.user.username,
      score: p.score,
    }));
  }
}
