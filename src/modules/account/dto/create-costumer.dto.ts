import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';
import { User } from '../../user/entity';
import { DeepPartial } from 'typeorm';

export class CreateCostumerDTO {
	@ApiProperty({ example: 'bdb34fb6-a43a-43af-92dc-0bcb29f3507c' })
	@IsUUID()
	@IsNotEmpty()
	owner_id: DeepPartial<User>;
}
