import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Allow } from 'class-validator';

import { Common } from '../../entity';
import { User } from '../../../user/entity';

@Entity()
export class Forgot extends Common {
	@Allow()
	@Column()
	@Index()
	hash: string;

	@Allow()
	@ManyToOne(() => User, {
		eager: true,
	})
	user: User;
}
