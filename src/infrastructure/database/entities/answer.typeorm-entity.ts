import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoomEntity } from './room.typeorm-entity';
import { UserEntity } from './user.typeorm-entity';
import { QuestionEntity } from './question.typeorm-entity';

@Entity('answers')
export class AnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column()
  questionId: string;

  @Column()
  selectedAnswer: number;

  @Column()
  isCorrect: boolean;

  @Column()
  timeSpent: number;

  @CreateDateColumn()
  answeredAt: Date;

  @ManyToOne(() => RoomEntity, (room) => room.answers)
  @JoinColumn({ name: 'roomId' })
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.answers)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => QuestionEntity, (question) => question.answers)
  @JoinColumn({ name: 'questionId' })
  question: QuestionEntity;
}
