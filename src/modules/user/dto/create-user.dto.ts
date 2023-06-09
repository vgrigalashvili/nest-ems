import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsNotExist } from '../../common/utils/validator';

import { lowerCaseTransformer } from '../../common/utils/transformer';
// import { Role } from '../../common/role/entity';
// import { Status } from '../../common/status/entity';

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

	// @ApiProperty({ type: Role })
	// @Validate(IsExist, ['Role', 'id'], {
	// 	message: 'roleNotExists',
	// })
	// role?: Role | null;

	// @ApiProperty({ type: Status })
	// @Validate(IsExist, ['Status', 'id'], {
	// 	message: 'statusNotExists',
	// })
	// status?: Status;

	hash?: string | null;
}
