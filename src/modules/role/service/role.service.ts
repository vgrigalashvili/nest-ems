import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from '../dto';

@Injectable()
export class RoleService {
	constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

	create(createRoleArgs: CreateRoleDTO): Promise<Role> {
		return this.roleRepo.save(this.roleRepo.create(createRoleArgs));
	}
}
