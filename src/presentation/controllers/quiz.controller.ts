import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { SubmitAnswerDto } from '../../application/dto/quiz/submit-answer.dto';
import { StartQuizUseCase } from '../../application/use-cases/quiz/start-quiz.use-case';
import { GetCurrentQuestionUseCase } from '../../application/use-cases/quiz/get-current-question.use-case';
import { SubmitAnswerUseCase } from '../../application/use-cases/quiz/submit-answer.use-case';
import { GetLeaderboardUseCase } from '../../application/use-cases/quiz/get-leaderboard.use-case';

@ApiTags('Quiz')
@ApiBearerAuth()
@Controller('api/v1/quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(
    private startQuizUseCase: StartQuizUseCase,
    private getCurrentQuestionUseCase: GetCurrentQuestionUseCase,
    private submitAnswerUseCase: SubmitAnswerUseCase,
    private getLeaderboardUseCase: GetLeaderboardUseCase,
  ) {}

  @Post('rooms/:roomId/start')
  @ApiOperation({ summary: 'Start quiz in a room (host only)' })
  @ApiResponse({ status: 200, description: 'Quiz started successfully' })
  async startQuiz(@Param('roomId') roomId: string, @CurrentUser() user: any) {
    return this.startQuizUseCase.execute(roomId, user.userId);
  }

  @Get('rooms/:roomId/question')
  @ApiOperation({ summary: 'Get current question in active quiz' })
  @ApiResponse({ status: 200, description: 'Current question retrieved' })
  async getCurrentQuestion(@Param('roomId') roomId: string) {
    return this.getCurrentQuestionUseCase.execute(roomId);
  }

  @Post('rooms/:roomId/answer')
  @ApiOperation({ summary: 'Submit answer to current question' })
  @ApiResponse({ status: 200, description: 'Answer submitted successfully' })
  async submitAnswer(
    @Param('roomId') roomId: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
    @CurrentUser() user: any,
  ) {
    return this.submitAnswerUseCase.execute(roomId, user.userId, submitAnswerDto);
  }

  @Get('rooms/:roomId/leaderboard')
  @ApiOperation({ summary: 'Get leaderboard for a room' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved' })
  async getLeaderboard(@Param('roomId') roomId: string) {
    return this.getLeaderboardUseCase.execute(roomId);
  }
}
