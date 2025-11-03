import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoomEntity } from './room.typeorm-entity';
import { UserEntity } from './user.typeorm-entity';

@Entity('room_participants')
export class RoomParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column({ default: 0 })
  score: number;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ nullable: true })
  leftAt: Date;

  @ManyToOne(() => RoomEntity, (room) => room.participants)
  @JoinColumn({ name: 'roomId' })
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.participations)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
