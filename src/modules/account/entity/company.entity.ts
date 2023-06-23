import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Common } from '../../common/entity';
import { User } from '../../user/entity';
import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

@Entity()
export class Company extends Common {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@ApiProperty({ example: 'b213251a-472c-4f36-af14-e8dd7dc9dfbe' })
	@OneToOne(() => User, (user) => user.id, { eager: true })
	@JoinColumn({ name: 'owner_id' })
	owner_id: User;

	@ApiProperty({ example: 415099306, description: 'public registry ID' })
	@Column({ type: 'bigint', nullable: false })
	public_id: number;

	@ApiProperty({ example: 'შ.პ.ს ონქსი' })
	@Column({ type: 'varchar', nullable: false })
	name: string;

	@ApiProperty({ example: 255.7, description: 'any bigint' })
	@Column({ type: 'decimal', nullable: true, precision: 10, default: 0 })
	@Min(0, { message: 'balance must be non-negative' })
	balance: number;

	@BeforeUpdate()
	@BeforeInsert()
	checkBalance() {
		if (this.balance < 0) {
			throw new Error('balance must be non-negative');
		}
	}
}
