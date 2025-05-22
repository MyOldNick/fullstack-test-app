import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Analyze } from './analyze.entity';
import { Status } from 'src/common/types/status.type';

@Entity()
export class Solution {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'text' })
  solution: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @ManyToOne(() => User, (user) => user.solutions)
  user: User;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToOne(() => Analyze, (Analyze) => Analyze.solution, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  analyze: Analyze;
}
