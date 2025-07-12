import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@Entity("users")
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

  @Column({ nullable: true })
  profilePhoto?: string;

  @Column({ 
    type: "enum", 
    enum: ["admin", "user", "moderator"], 
    default: "user" 
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
