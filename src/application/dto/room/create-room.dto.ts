import { IsNotEmpty, IsString, IsUUID, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'My Quiz Room' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  quizId: string;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @Min(2)
  @Max(100)
  @IsOptional()
  maxPlayers?: number;
}
