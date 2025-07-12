import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Answer } from "./Answer";
import { Image } from "./Image";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column("text", { array: true })
  tags: string[];

  @Column({ nullable: true })
  acceptedAnswerId: string;

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];

  @OneToMany(() => Image, (image) => image.question)
  images: Image[];
}
