import { DataSource } from 'typeorm';
import { QuizEntity } from '../entities/quiz.typeorm-entity';
import { QuestionEntity } from '../entities/question.typeorm-entity';
import { UserEntity } from '../entities/user.typeorm-entity';
import { RoomEntity } from '../entities/room.typeorm-entity';
import { RoomParticipantEntity } from '../entities/room-participant.typeorm-entity';
import { AnswerEntity } from '../entities/answer.typeorm-entity';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [UserEntity, QuizEntity, QuestionEntity, RoomEntity, RoomParticipantEntity, AnswerEntity],
  synchronize: true,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Database connected');

    const quizRepository = dataSource.getRepository(QuizEntity);
    const questionRepository = dataSource.getRepository(QuestionEntity);

    const existingQuizzes = await quizRepository.count();
    if (existingQuizzes > 0) {
      console.log('Database already seeded. Skipping...');
      await dataSource.destroy();
      return;
    }

    const quiz1 = quizRepository.create({
      title: 'General Knowledge Quiz',
      description: 'Test your knowledge on various topics!',
    });
    await quizRepository.save(quiz1);

    const questions1 = [
      {
        quizId: quiz1.id,
        questionText: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        timeLimit: 30,
        points: 10,
        order: 1,
      },
      {
        quizId: quiz1.id,
        questionText: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        timeLimit: 30,
        points: 10,
        order: 2,
      },
      {
        quizId: quiz1.id,
        questionText: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
        correctAnswer: 2,
        timeLimit: 30,
        points: 10,
        order: 3,
      },
      {
        quizId: quiz1.id,
        questionText: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 3,
        timeLimit: 30,
        points: 10,
        order: 4,
      },
      {
        quizId: quiz1.id,
        questionText: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
        timeLimit: 30,
        points: 10,
        order: 5,
      },
    ];

    for (const q of questions1) {
      const question = questionRepository.create(q);
      await questionRepository.save(question);
    }

    const quiz2 = quizRepository.create({
      title: 'Science & Technology',
      description: 'Challenge yourself with science and tech questions!',
    });
    await quizRepository.save(quiz2);

    const questions2 = [
      {
        quizId: quiz2.id,
        questionText: 'What does CPU stand for?',
        options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Processor Unit'],
        correctAnswer: 1,
        timeLimit: 30,
        points: 10,
        order: 1,
      },
      {
        quizId: quiz2.id,
        questionText: 'What is the speed of light?',
        options: ['299,792 km/s', '150,000 km/s', '400,000 km/s', '250,000 km/s'],
        correctAnswer: 0,
        timeLimit: 30,
        points: 10,
        order: 2,
      },
      {
        quizId: quiz2.id,
        questionText: 'Who developed the theory of relativity?',
        options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Stephen Hawking'],
        correctAnswer: 1,
        timeLimit: 30,
        points: 10,
        order: 3,
      },
      {
        quizId: quiz2.id,
        questionText: 'What is the most abundant gas in Earth\'s atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 2,
        timeLimit: 30,
        points: 10,
        order: 4,
      },
      {
        quizId: quiz2.id,
        questionText: 'What programming language is known for its use in web development?',
        options: ['Python', 'JavaScript', 'C++', 'Ruby'],
        correctAnswer: 1,
        timeLimit: 30,
        points: 10,
        order: 5,
      },
    ];

    for (const q of questions2) {
      const question = questionRepository.create(q);
      await questionRepository.save(question);
    }

    const quiz3 = quizRepository.create({
      title: 'Pop Culture Trivia',
      description: 'How well do you know movies, music, and entertainment?',
    });
    await quizRepository.save(quiz3);

    const questions3 = [
      {
        quizId: quiz3.id,
        questionText: 'Who directed the movie "Inception"?',
        options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'Quentin Tarantino'],
        correctAnswer: 1,
        timeLimit: 30,
        points: 10,
        order: 1,
      },
      {
        quizId: quiz3.id,
        questionText: 'Which band released the album "Abbey Road"?',
        options: ['The Rolling Stones', 'Led Zeppelin', 'The Beatles', 'Pink Floyd'],
        correctAnswer: 2,
        timeLimit: 30,
        points: 10,
        order: 2,
      },
      {
        quizId: quiz3.id,
        questionText: 'What is the highest-grossing film of all time?',
        options: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Star Wars: The Force Awakens'],
        correctAnswer: 1,
        timeLimit: 30,
        points: 10,
        order: 3,
      },
    ];

    for (const q of questions3) {
      const question = questionRepository.create(q);
      await questionRepository.save(question);
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${await quizRepository.count()} quizzes`);
    console.log(`Created ${await questionRepository.count()} questions`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
