import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Question } from "./Question";
import { Answer } from "./Answer";
import { Image } from "./Image";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  role: string;

  @Column()
  name: string;
  
  @Column()
  email: string;

  @Column("json", { nullable: true })
  notifications: { title: string; description: string }[];

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @OneToOne(() => Image, (image) => image.user)
  @JoinColumn()
  image: Image;
}
