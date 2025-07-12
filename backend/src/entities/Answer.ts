import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Question } from "./Question";
import { Image } from "./Image";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;

  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @OneToMany(() => Image, (image) => image.answer)
  images: Image[];
}
