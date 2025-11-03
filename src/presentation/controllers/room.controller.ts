import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { CreateRoomDto } from '../../application/dto/room/create-room.dto';
import { JoinRoomDto } from '../../application/dto/room/join-room.dto';
import { CreateRoomUseCase } from '../../application/use-cases/room/create-room.use-case';
import { JoinRoomUseCase } from '../../application/use-cases/room/join-room.use-case';
import { LeaveRoomUseCase } from '../../application/use-cases/room/leave-room.use-case';
import { GetRoomUseCase } from '../../application/use-cases/room/get-room.use-case';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('api/v1/rooms')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(
    private createRoomUseCase: CreateRoomUseCase,
    private joinRoomUseCase: JoinRoomUseCase,
    private leaveRoomUseCase: LeaveRoomUseCase,
    private getRoomUseCase: GetRoomUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  async createRoom(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: any) {
    return this.createRoomUseCase.execute(createRoomDto, user.userId);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a room by code' })
  @ApiResponse({ status: 200, description: 'Successfully joined room' })
  async joinRoom(@Body() joinRoomDto: JoinRoomDto, @CurrentUser() user: any) {
    return this.joinRoomUseCase.execute(joinRoomDto.code, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room details' })
  @ApiResponse({ status: 200, description: 'Room details retrieved' })
  async getRoom(@Param('id') id: string) {
    return this.getRoomUseCase.execute(id);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave a room' })
  @ApiResponse({ status: 200, description: 'Successfully left room' })
  async leaveRoom(@Param('id') id: string, @CurrentUser() user: any) {
    await this.leaveRoomUseCase.execute(id, user.userId);
    return { message: 'Successfully left room' };
  }
}
