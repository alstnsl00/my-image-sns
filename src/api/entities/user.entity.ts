import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 20,
    nullable: false,
    unique: true,
    comment: '사용자 아이디',
  })
  userId: string;

  @Column('varchar', {
    length: 20,
    nullable: false,
    comment: '사용자 이름',
  })
  userName: string;

  @Column({ nullable: false, comment: '사용자 비밀번호' })
  password: string;

  @Column({ nullable: false, length: 10, comment: '사용자/관리자 구분', default: 'user' }) // user / manager
  type: string;

  @CreateDateColumn({ name: 'createdAt', comment: '생성일' }) // type: 'timestamptz' - MySQL만 지원
  createdAt: Date;

  @CreateDateColumn({ name: 'updatedAt', comment: '갱신일' })
  updatedAt: Date;
}
