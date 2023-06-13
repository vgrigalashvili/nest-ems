import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';

import { IsNotExist } from '../../common/utils/validator';

import { lowerCaseTransformer } from '../../common/utils/transformer';

export class CreateUserDTO {
	@ApiProperty({ example: 'test1@example.com' })
	@Transform(lowerCaseTransformer)
	@IsNotEmpty()
	@Validate(IsNotExist, ['User'], {
		message: 'emailAlreadyExists',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty()
	@MinLength(6)
	password: string;

	provider?: string;

	@ApiProperty({ example: 'John' })
	@IsNotEmpty()
	@MinLength(3)
	firstName: string;

	@ApiProperty({ example: 'Doe' })
	@IsNotEmpty()
	@MinLength(3)
	lastName: string;

	hash?: string | null;
}
