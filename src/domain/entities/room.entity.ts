import { RoomStatus } from '../enums/room-status.enum';

export class Room {
  id: string;
  code: string;
  name: string;
  hostId: string;
  status: RoomStatus;
  quizId: string;
  maxPlayers: number;
  createdAt: Date;
  updatedAt: Date;
}
