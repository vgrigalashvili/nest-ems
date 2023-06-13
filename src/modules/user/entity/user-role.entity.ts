import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

import { Role } from '../../role/entity/role.entity';
import { User } from './';
import { Common } from '../../common/entity';

@Entity()
export class UserRole extends Common {
	@ApiProperty({ example: 1 })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ example: 'b213251a-472c-4f36-af14-e8dd7dc9dfbe' })
	@ManyToOne(() => User, (user) => user.id, { eager: true })
	@JoinColumn({
		name: 'user_id',
	})
	user_id: User;

	@Allow()
	@ApiProperty({ example: 1 })
	@ManyToOne(() => Role, (role) => role.id, { eager: true })
	@JoinColumn({
		name: 'role_id',
	})
	role_id: Role;
}
