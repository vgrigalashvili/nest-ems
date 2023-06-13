import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';

import { CreateUserDTO } from './';
import { IsNotExist } from '../../common/utils/validator';
import { lowerCaseTransformer } from '../../common/utils/transformer';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
	@ApiProperty({ example: 'test1@example.com' })
	@Transform(lowerCaseTransformer)
	@IsOptional()
	@Validate(IsNotExist, ['User'], {
		message: 'emailAlreadyExists',
	})
	@IsEmail()
	override email?: string;

	@ApiProperty()
	@IsOptional()
	@MinLength(6)
	override password?: string;

	@ApiProperty({ example: 'John' })
	@IsOptional()
	override firstName?: string;

	@ApiProperty({ example: 'Doe' })
	@IsOptional()
	override lastName?: string;
}
