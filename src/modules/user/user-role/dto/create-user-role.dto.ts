import { ApiProperty } from '@nestjs/swagger';

import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserRoleDTO {
	@ApiProperty({ example: 'bdb34fb6-a43a-43af-92dc-0bcb29f3507c' })
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@ApiProperty({ example: [1, 2, 3] })
	@IsArray()
	@ArrayNotEmpty({ message: `Please provide array with a valid role ID's !` })
	roles: number[];
}
