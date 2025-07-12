import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Question } from "./Question";
import { Answer } from "./Answer";

@Entity()
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  bufferString: string;

  @OneToOne(() => User, (user) => user.image)
  user: User;

  @ManyToOne(() => Question, (question) => question.images, { nullable: true })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.images, { nullable: true })
  answer: Answer;
}
