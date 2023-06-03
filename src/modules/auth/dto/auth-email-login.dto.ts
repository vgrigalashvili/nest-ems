import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsExist } from '../../common/utils/validator';
import { lowerCaseTransformer } from '../../common/utils/transformer';

export class AuthEmailLoginDTO {
	@ApiProperty({ example: 'test1@example.com' })
	@Transform(lowerCaseTransformer)
	@Validate(IsExist, ['User'], {
		message: 'emailNotExists',
	})
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	password: string;
}
