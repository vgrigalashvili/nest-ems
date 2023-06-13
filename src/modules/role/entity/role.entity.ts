import { ApiProperty } from '@nestjs/swagger';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Allow } from 'class-validator';

import { Common } from '../../common/entity';

@Entity()
export class Role extends Common {
	@ApiProperty({ example: 1 })
	@PrimaryGeneratedColumn()
	id: number;

	@Allow()
	@ApiProperty({ example: 'Admin' })
	@Column({ type: 'varchar', nullable: false })
	name: string;
}
