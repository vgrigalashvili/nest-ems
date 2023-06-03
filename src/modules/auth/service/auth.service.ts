import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';

import { User } from '../../user/entity';
import { Role } from '../../common/role/entity';
import { Status } from '../../common/status/entity';

import { AuthEmailLoginDTO, AuthUpdateDTO, AuthRegisterLoginDTO } from '../dto';

import { RoleEnum } from '../../common/role/enum';
import { StatusEnum } from '../../common/status';

import { AuthProvidersEnum } from '../enum';

import { NullableType } from '../../common/utils/types';
import { LoginResponseType } from '../../common/utils/types/auth';
import { ForgotService } from '../../common/forgot/service';
import { MailService } from '../../common/mail/service';
import { UserService } from '../../user/service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UserService,
		private forgotService: ForgotService,
		private mailService: MailService
	) {}

	async validateLogin(loginDTO: AuthEmailLoginDTO, onlyAdmin: boolean): Promise<LoginResponseType> {
		const user = await this.usersService.findOne({
			email: loginDTO.email,
		});

		if (!user || (user?.role && !(onlyAdmin ? [RoleEnum.admin] : [RoleEnum.user]).includes(user.role.id))) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						email: 'notFound',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY
			);
		}

		if (user.provider !== AuthProvidersEnum.email) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						email: `needLoginViaProvider:${user.provider}`,
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY
			);
		}

		const validPassword = await bcrypt.compare(loginDTO.password, user.password);

		if (!validPassword) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						password: 'incorrectPassword',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY
			);
		}

		const token = this.jwtService.sign({
			id: user.id,
			role: user.role,
		});

		return { token, user };
	}

	// async validateSocialLogin(authProvider: string, socialData: SocialInterface): Promise<LoginResponseType> {
	// 	let user: NullableType<User>;
	// 	const socialEmail = socialData.email?.toLowerCase();

	// 	const userByEmail = await this.usersService.findOne({
	// 		email: socialEmail,
	// 	});

	// 	user = await this.usersService.findOne({
	// 		socialId: socialData.id,
	// 		provider: authProvider,
	// 	});

	// 	if (user) {
	// 		if (socialEmail && !userByEmail) {
	// 			user.email = socialEmail;
	// 		}
	// 		await this.usersService.update(user.id, user);
	// 	} else if (userByEmail) {
	// 		user = userByEmail;
	// 	} else {
	// 		const role = plainToClass(Role, {
	// 			id: RoleEnum.user,
	// 		});
	// 		const status = plainToClass(Status, {
	// 			id: StatusEnum.active,
	// 		});

	// 		user = await this.usersService.create({
	// 			email: socialEmail ?? null,
	// 			firstName: socialData.firstName ?? null,
	// 			lastName: socialData.lastName ?? null,
	// 			socialId: socialData.id,
	// 			provider: authProvider,
	// 			role,
	// 			status,
	// 		});

	// 		user = await this.usersService.findOne({
	// 			id: user.id,
	// 		});
	// 	}

	// 	if (!user) {
	// 		throw new HttpException(
	// 			{
	// 				status: HttpStatus.UNPROCESSABLE_ENTITY,
	// 				errors: {
	// 					user: 'userNotFound',
	// 				},
	// 			},
	// 			HttpStatus.UNPROCESSABLE_ENTITY
	// 		);
	// 	}

	// 	const jwtToken = this.jwtService.sign({
	// 		id: user.id,
	// 		role: user.role,
	// 	});

	// 	return {
	// 		token: jwtToken,
	// 		user,
	// 	};
	// }

	async register(registerArgs: AuthRegisterLoginDTO): Promise<void> {
		const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');

		await this.usersService.create({
			...registerArgs,
			email: registerArgs.email,
			role: {
				id: RoleEnum.user,
			} as Role,
			status: {
				id: StatusEnum.inactive,
			} as Status,
			hash,
		});

		await this.mailService.userSignUp({
			to: registerArgs.email,
			data: {
				hash,
			},
		});
	}

	async confirmEmail(hash: string): Promise<void> {
		const user = await this.usersService.findOne({
			hash,
		});

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: `notFound`,
				},
				HttpStatus.NOT_FOUND
			);
		}

		user.hash = null;
		user.status = plainToClass(Status, {
			id: StatusEnum.active,
		});
		await user.save();
	}

	async forgotPassword(email: string): Promise<void> {
		const user = await this.usersService.findOne({
			email,
		});

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						email: 'emailNotExists',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY
			);
		}

		const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');
		await this.forgotService.create({
			hash,
			user,
		});

		await this.mailService.forgotPassword({
			to: email,
			data: {
				hash,
			},
		});
	}

	async resetPassword(hash: string, password: string): Promise<void> {
		const forgot = await this.forgotService.findOne({
			where: {
				hash,
			},
		});

		if (!forgot) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						hash: `notFound`,
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY
			);
		}

		const user = forgot.user;
		user.password = password;

		await user.save();
		await this.forgotService.softDelete(forgot.id);
	}

	async me(user: User): Promise<NullableType<User>> {
		return this.usersService.findOne({
			id: user.id,
		});
	}

	async update(user: User, updateArgs: AuthUpdateDTO): Promise<NullableType<User>> {
		if (updateArgs.password) {
			if (updateArgs.oldPassword) {
				const currentUser = await this.usersService.findOne({
					id: user.id,
				});

				if (!currentUser) {
					throw new HttpException(
						{
							status: HttpStatus.UNPROCESSABLE_ENTITY,
							errors: {
								user: 'userNotFound',
							},
						},
						HttpStatus.UNPROCESSABLE_ENTITY
					);
				}

				const validOldPassword = await bcrypt.compare(updateArgs.oldPassword, currentUser.password);

				if (!validOldPassword) {
					throw new HttpException(
						{
							status: HttpStatus.UNPROCESSABLE_ENTITY,
							errors: {
								oldPassword: 'incorrectOldPassword',
							},
						},
						HttpStatus.UNPROCESSABLE_ENTITY
					);
				}
			} else {
				throw new HttpException(
					{
						status: HttpStatus.UNPROCESSABLE_ENTITY,
						errors: {
							oldPassword: 'missingOldPassword',
						},
					},
					HttpStatus.UNPROCESSABLE_ENTITY
				);
			}
		}

		await this.usersService.update(user.id, updateArgs);

		return this.usersService.findOne({
			id: user.id,
		});
	}

	async softDelete(user: User): Promise<void> {
		await this.usersService.softDelete(user.id);
	}
}
