import { Solution } from 'src/modules/llm/entities/solution.entity';
import { hashPassword } from 'src/utils/hash-password.util';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  // TOOD: create a unique id for the user using uuid for production
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => Solution, (solution) => solution.user)
  @JoinColumn()
  solutions: Array<Solution>;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await hashPassword(this.password);
  }
}
