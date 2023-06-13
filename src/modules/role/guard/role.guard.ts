import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { UserRoleService } from '../../user/service';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector, private userRoleService: UserRoleService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.getAllAndOverride<number[]>('role', [context.getClass(), context.getHandler()]);

		if (!roles.length) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const userRoles = await this.userRoleService.getUserRoles({ id: request.user.id });

		return roles.some((role) => userRoles.includes(role));
	}
}
