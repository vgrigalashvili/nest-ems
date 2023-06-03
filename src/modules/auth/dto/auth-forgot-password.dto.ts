import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

import { lowerCaseTransformer } from '../../common/utils/transformer';

export class AuthForgotPasswordDTO {
	@ApiProperty()
	@Transform(lowerCaseTransformer)
	@IsEmail()
	email: string;
}
