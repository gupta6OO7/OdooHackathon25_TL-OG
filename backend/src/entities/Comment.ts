import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import { Answer } from "./Answer";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @ManyToOne(() => Answer, answer => answer.comments, { onDelete: "CASCADE" })
  answer: Answer;
}
