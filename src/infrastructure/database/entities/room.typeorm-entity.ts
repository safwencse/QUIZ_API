import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { RoomStatus } from '../../../domain/enums/room-status.enum';
import { UserEntity } from './user.typeorm-entity';
import { QuizEntity } from './quiz.typeorm-entity';
import { RoomParticipantEntity } from './room-participant.typeorm-entity';
import { AnswerEntity } from './answer.typeorm-entity';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 6 })
  code: string;

  @Column()
  name: string;

  @Column()
  hostId: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.WAITING,
  })
  status: RoomStatus;

  @Column()
  quizId: string;

  @Column({ default: 10 })
  maxPlayers: number;

  @Column({ default: 0 })
  currentQuestionIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.hostedRooms)
  @JoinColumn({ name: 'hostId' })
  host: UserEntity;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.rooms)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;

  @OneToMany(() => RoomParticipantEntity, (participant) => participant.room)
  participants: RoomParticipantEntity[];

  @OneToMany(() => AnswerEntity, (answer) => answer.room)
  answers: AnswerEntity[];
}
