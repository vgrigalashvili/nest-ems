import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNotEmpty, MinLength, Validate } from 'class-validator';

import { IsNotExist } from '../../common/utils/validator';

import { lowerCaseTransformer } from '../../common/utils/transformer';

export class CreateRoleDTO {
	@ApiProperty({ example: 'admin, user, accountant, etc...' })
	@Transform(lowerCaseTransformer)
	@IsNotEmpty()
	@Validate(IsNotExist, ['Role'], {
		message: 'roleAlreadyExists',
	})
	@MinLength(3)
	name: string;
}
