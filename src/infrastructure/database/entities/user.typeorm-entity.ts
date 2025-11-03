import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { RoomParticipantEntity } from './room-participant.typeorm-entity';
import { AnswerEntity } from './answer.typeorm-entity';
import { RoomEntity } from './room.typeorm-entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RoomEntity, (room) => room.host)
  hostedRooms: RoomEntity[];

  @OneToMany(() => RoomParticipantEntity, (participant) => participant.user)
  participations: RoomParticipantEntity[];

  @OneToMany(() => AnswerEntity, (answer) => answer.user)
  answers: AnswerEntity[];
}
