import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Solution } from './solution.entity';

@Entity()
export class Analyze {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'text' })
  distortions: string;

  @Column({ type: 'text' })
  alternative: string;

  @OneToOne(() => Solution, (solution) => solution.analyze)
  solution: Solution;
}
