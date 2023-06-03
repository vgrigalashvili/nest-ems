import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthConfirmEmailDTO {
	@ApiProperty()
	@IsNotEmpty()
	hash: string;
}
