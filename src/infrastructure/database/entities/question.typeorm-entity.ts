import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { QuizEntity } from './quiz.typeorm-entity';
import { AnswerEntity } from './answer.typeorm-entity';

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quizId: string;

  @Column({ type: 'text' })
  questionText: string;

  @Column('simple-array')
  options: string[];

  @Column()
  correctAnswer: number;

  @Column({ default: 30 })
  timeLimit: number;

  @Column({ default: 10 })
  points: number;

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.questions)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;

  @OneToMany(() => AnswerEntity, (answer) => answer.question)
  answers: AnswerEntity[];
}
