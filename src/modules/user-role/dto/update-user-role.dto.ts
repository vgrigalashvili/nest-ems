import { ApiProperty } from '@nestjs/swagger';

import { ArrayNotEmpty, IsArray } from 'class-validator';

export class UpdateUserRoleDTO {
	@ApiProperty({ example: [1, 2, 3] })
	@IsArray()
	@ArrayNotEmpty({ message: `Please provide array with a valid role ID's !` })
	roles: number[];
}
