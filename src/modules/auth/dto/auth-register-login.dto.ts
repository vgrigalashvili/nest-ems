import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsNotExist } from '../../common/utils/validator';
import { lowerCaseTransformer } from '../../common/utils/transformer';

export class AuthRegisterLoginDTO {
	@ApiProperty({ example: 'test1@example.com' })
	@Transform(lowerCaseTransformer)
	@Validate(IsNotExist, ['User'], {
		message: 'Email Taken!',
	})
	@IsEmail()
	email: string;

	@ApiProperty()
	@MinLength(6)
	password: string;

	@ApiProperty({ example: 'John' })
	@IsNotEmpty()
	@MinLength(3)
	firstName: string;

	@ApiProperty({ example: 'Doe' })
	@IsNotEmpty()
	@MinLength(3)
	lastName: string;
}
