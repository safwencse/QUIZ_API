import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  selectedAnswer: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  timeSpent: number;
}
