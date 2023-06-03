import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthResetPasswordDTO {
	@ApiProperty()
	@IsNotEmpty()
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	hash: string;
}
