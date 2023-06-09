import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Allow } from 'class-validator';

import { Common } from '../../common/entity';
import { User } from '../../user/entity';

@Entity()
export class Forgot extends Common {
	@PrimaryGeneratedColumn()
	id: number;

	@Allow()
	@Column({ type: 'text', nullable: false })
	@Index()
	hash: string;

	@Allow()
	@ManyToOne(() => User, {
		eager: true,
	})
	@JoinColumn({ name: 'user_id' })
	user: User;
}
