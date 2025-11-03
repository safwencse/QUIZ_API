import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../../infrastructure/database/entities/room.typeorm-entity';
import { QuizEntity } from '../../../infrastructure/database/entities/quiz.typeorm-entity';
import { CreateRoomDto } from '../../dto/room/create-room.dto';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(QuizEntity)
    private quizRepository: Repository<QuizEntity>,
  ) {}

  async execute(createRoomDto: CreateRoomDto, hostId: string): Promise<RoomEntity> {
    const quiz = await this.quizRepository.findOne({ where: { id: createRoomDto.quizId } });
    
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const code = this.generateRoomCode();

    const room = this.roomRepository.create({
      name: createRoomDto.name,
      quizId: createRoomDto.quizId,
      hostId,
      code,
      maxPlayers: createRoomDto.maxPlayers || 10,
    });

    return await this.roomRepository.save(room);
  }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
