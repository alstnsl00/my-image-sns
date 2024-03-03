import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 20,
    nullable: false,
    comment: '사용자 아이디',
  })
  userId: string;

  @Column({ length: 50, nullable: false, comment: '이미지 경로' })
  filename: string;

  @Column({ length: 10, nullable: false, comment: '이미지 타입', default: 'etc' }) // basic / content / profile / icon / symbol / logo / etc
  type: string;

  @CreateDateColumn({ name: 'createdAt', comment: '생성일' }) // type: 'timestamptz' - MySQL만 지원
  createdAt: Date;

  @CreateDateColumn({ name: 'updatedAt', comment: '갱신일' })
  updatedAt: Date;
}
