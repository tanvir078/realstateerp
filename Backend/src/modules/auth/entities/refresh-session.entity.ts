import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_sessions')
@Index(['userId', 'revokedAt'])
export class RefreshSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  tokenId: string;

  @Column({ length: 64 })
  tokenHash: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt?: Date;

  @Column({ nullable: true })
  replacedByTokenId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
