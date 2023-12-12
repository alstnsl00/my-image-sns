import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 20,
    nullable: false,
    comment: '사용자 아이디',
  })
  userId: string;

  @Column({ nullable: false, comment: '이미지 아이디' })
  imageId: number;

  @Column({ length: 255, nullable: false, comment: '이미지 댓글' })
  comment: string;

  @CreateDateColumn({ name: 'createdAt', comment: '생성일' }) // type: 'timestamptz' - MySQL만 지원
  createdAt: Date;

  @CreateDateColumn({ name: 'updatedAt', comment: '갱신일' })
  updatedAt: Date;
}
