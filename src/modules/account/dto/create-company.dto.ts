import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompanyDTO {
	@ApiProperty({ example: 415099306 })
	@IsNotEmpty()
	@IsNumber()
	public_id: number;

	@ApiProperty({ example: 'შ.პ.ს ონქსი' })
	@IsString()
	@IsNotEmpty()
	name: string;
}
