import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
// import { plainToClass } from 'class-transformer';

import { User } from '../../user/entity';
// import { Role } from '../../common/role/entity';
// import { Status } from '../../common/status/entity';

import { AuthEmailLoginDTO, AuthUpdateDTO, AuthRegisterLoginDTO } from '../dto';

// import { RoleEnum } from '../../common/role/enum';
// import { StatusEnum } from '../../common/status';

import { AuthProvidersEnum } from '../enum';

import { NullableType } from '../../common/utils/types';
import { LoginResponseType } from '../../common/utils/types/auth';
import { ForgotService } from '../../forgot/service';
import { MailService } from '../../common/mail/service';
import { UserService } from '../../user/service';
import { UserRoleService } from '../../user-role/service';
import { RoleEnum } from '../../role/enum';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private userRoleService: UserRoleService,

		private forgotService: ForgotService,
		private mailService: MailService
	) {}

	async validateLogin(loginDTO: AuthEmailLoginDTO): Promise<LoginResponseType> {
		const user = await this.userService.findOne({
			email: loginDTO.email,
		});

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						email: 'User with particular email not found!',
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
						email: `Need Login Via Provider:${user.provider}`,
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
						password: 'Incorrect Password',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY
			);
		}

		const token = this.jwtService.sign({
			id: user.id,
		});

		return { token, user };
	}

	async register(registerArgs: AuthRegisterLoginDTO): Promise<void> {
		const hash = crypto.createHash('sha256').update(randomStringGenerator()).digest('hex');

		await this.userService.create({
			...registerArgs,
			email: registerArgs.email,
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
		const user = await this.userService.findOne({
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
		user.mail_verified = true;
		this.userRoleService.create({ id: user.id, roles: [RoleEnum.user] });
		await user.save();
	}

	async forgotPassword(email: string): Promise<void> {
		const user = await this.userService.findOne({
			email,
		});

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						email: 'Email Not Exists',
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
		return this.userService.findOne({
			id: user.id,
		});
	}

	async update(user: User, updateArgs: AuthUpdateDTO): Promise<NullableType<User>> {
		if (updateArgs.password) {
			if (updateArgs.oldPassword) {
				const currentUser = await this.userService.findOne({
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
							oldPassword: 'Missing Old Password',
						},
					},
					HttpStatus.UNPROCESSABLE_ENTITY
				);
			}
		}

		await this.userService.update(user.id, updateArgs);

		return this.userService.findOne({
			id: user.id,
		});
	}

	async softDelete(user: User): Promise<void> {
		await this.userService.softDelete(user.id);
	}
}
