import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
import { Common } from '../../common/entity';

import * as bcrypt from 'bcryptjs';

@Entity()
export class User extends Common {
	@Index({ unique: true })
	@Column({ type: String, unique: true, nullable: false })
	email: string;

	@Column({ type: 'text', nullable: false })
	password: string;

	@BeforeInsert()
	@BeforeUpdate()
	async setPassword() {
		const salt = await bcrypt.genSalt();
		this.password = await bcrypt.hash(this.password, salt);
	}

	@Column({ type: 'varchar', nullable: false })
	firstName: string;

	@Column({ type: 'varchar', nullable: false })
	lastName: string;

	@Column({ type: 'varchar', length: 9, nullable: true })
	mobile: string;
}
