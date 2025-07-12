import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Question } from "./Question";
import { Answer } from "./Answer";
import { Image } from "./Image";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @Column({ unique: true })
  @IsNotEmpty({ message: "Username is required" })
  userName: string;
  
  @Column({ unique: true })
  @IsEmail({}, { message: "Please provide a valid email" })
  email: string;

  @Column()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column("json", { nullable: true })
  notifications: { unread: string[]; read: string[] };

  @Column("json", { nullable: true })
  votes:  Record<string, number>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @OneToOne(() => Image, (image) => image.user, { nullable: true })
  @JoinColumn()
  image: Image;
}
