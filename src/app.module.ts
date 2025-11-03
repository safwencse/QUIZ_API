import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './infrastructure/modules/auth.module';
import { RoomModule } from './infrastructure/modules/room.module';
import { QuizModule } from './infrastructure/modules/quiz.module';
import { databaseConfig } from './infrastructure/config/database.config';
import { jwtConfig } from './infrastructure/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
    RoomModule,
    QuizModule,
  ],
})
export class AppModule {}
