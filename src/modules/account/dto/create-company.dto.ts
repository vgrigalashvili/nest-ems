import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { User } from '../../user/entity';
import { DeepPartial } from 'typeorm';

export class CreateCompanyDTO {
	@ApiProperty({ example: 'bdb34fb6-a43a-43af-92dc-0bcb29f3507c' })
	@IsUUID()
	@IsNotEmpty()
	owner_id: DeepPartial<User>;

	@ApiProperty({ example: 415099306 })
	@IsNotEmpty()
	@IsNumber()
	public_id: number;

	@ApiProperty({ example: 'შ.პ.ს ონქსი' })
	@IsString()
	@IsNotEmpty()
	name: string;
}
