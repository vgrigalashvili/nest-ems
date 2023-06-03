import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';

import { Common } from '../../common/entity';
import { AuthProvidersEnum } from '../../auth/enum';
import { Role } from '../../common/role/entity';
import { Status } from '../../common/status/entity';

@Entity()
export class User extends Common {
	@Index({ unique: true })
	@Column({ type: String, unique: true, nullable: false })
	email: string;

	@Column({ type: 'text', nullable: false })
	@Exclude({ toPlainOnly: true })
	password: string;

	@Exclude({ toPlainOnly: true })
	public previousPassword: string;

	@AfterLoad()
	public loadPreviousPassword(): void {
		this.previousPassword = this.password;
	}

	@BeforeInsert()
	@BeforeUpdate()
	async setPassword() {
		if (this.previousPassword !== this.password && this.password) {
			const salt = await bcrypt.genSalt();
			this.password = await bcrypt.hash(this.password, salt);
		}
	}

	@Column({ default: AuthProvidersEnum.email })
	@Expose({ groups: ['me', 'admin'] })
	provider: string;

	@Column({ type: 'varchar', nullable: false })
	firstName: string;

	@Column({ type: 'varchar', nullable: false })
	lastName: string;

	@Column({ type: 'varchar', length: 9, nullable: true })
	mobile: string;

	@ManyToOne(() => Role, {
		eager: true,
	})
	role?: Role | null;

	@ManyToOne(() => Status, {
		eager: true,
	})
	status?: Status;

	@Column({ type: String, nullable: true })
	@Index()
	@Exclude({ toPlainOnly: true })
	hash: string | null;
}
