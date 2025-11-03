import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../infrastructure/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QuizGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private roomUsers: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.roomUsers.forEach((users, roomId) => {
      if (users.has(client.id)) {
        users.delete(client.id);
        this.server.to(roomId).emit('playerLeft', { clientId: client.id });
      }
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; username: string },
  ) {
    const { roomId, username } = data;
    
    client.join(roomId);
    
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    this.roomUsers.get(roomId).add(client.id);

    this.server.to(roomId).emit('playerJoined', {
      clientId: client.id,
      username,
    });

    return { success: true, roomId };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    
    client.leave(roomId);
    
    if (this.roomUsers.has(roomId)) {
      this.roomUsers.get(roomId).delete(client.id);
    }

    this.server.to(roomId).emit('playerLeft', { clientId: client.id });

    return { success: true };
  }

  emitQuizStarted(roomId: string) {
    this.server.to(roomId).emit('quizStarted', { roomId });
  }

  emitNextQuestion(roomId: string, question: any) {
    this.server.to(roomId).emit('nextQuestion', question);
  }

  emitAnswerSubmitted(roomId: string, data: any) {
    this.server.to(roomId).emit('answerSubmitted', data);
  }

  emitLeaderboardUpdate(roomId: string, leaderboard: any) {
    this.server.to(roomId).emit('leaderboardUpdate', leaderboard);
  }

  emitQuizFinished(roomId: string, finalLeaderboard: any) {
    this.server.to(roomId).emit('quizFinished', { finalLeaderboard });
  }
}
