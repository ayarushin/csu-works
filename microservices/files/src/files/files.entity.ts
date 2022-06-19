import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'Files' })
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'created_by' }) // You can use @OneToOne
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
