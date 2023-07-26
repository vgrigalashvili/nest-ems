import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, UseGuards, Patch, SerializeOptions, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from '../service';
import {
	AuthEmailLoginDTO,
	AuthRegisterLoginDTO,
	AuthUpdateDTO,
	AuthForgotPasswordDTO,
	AuthConfirmEmailDTO,
	AuthResetPasswordDTO,
} from '../dto';

import { LoginResponseType } from '../../common/utils/types/auth';
import { User } from '../../user/entity';
import { NullableType } from '../../common/utils/types';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@SerializeOptions({ groups: ['me'] })
	@Post('email/login')
	@HttpCode(HttpStatus.OK)
	public login(@Body() loginDTO: AuthEmailLoginDTO): Promise<LoginResponseType> {
		return this.authService.validateLogin(loginDTO, false);
	}

	@SerializeOptions({ groups: ['me'] })
	@Post('admin/email/login')
	@HttpCode(HttpStatus.OK)
	public adminLogin(@Body() loginDTO: AuthEmailLoginDTO): Promise<LoginResponseType> {
		return this.authService.validateLogin(loginDTO, true);
	}

	@Post('email/register')
	@HttpCode(HttpStatus.NO_CONTENT)
	async register(@Body() createUserDTO: AuthRegisterLoginDTO): Promise<void> {
		return this.authService.register(createUserDTO);
	}

	@Post('email/confirm')
	@HttpCode(HttpStatus.NO_CONTENT)
	async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDTO): Promise<void> {
		return this.authService.confirmEmail(confirmEmailDto.hash);
	}

	@Post('forgot/password')
	@HttpCode(HttpStatus.NO_CONTENT)
	async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDTO): Promise<void> {
		return this.authService.forgotPassword(forgotPasswordDto.email);
	}

	@Post('reset/password')
	@HttpCode(HttpStatus.NO_CONTENT)
	resetPassword(@Body() resetPasswordDto: AuthResetPasswordDTO): Promise<void> {
		return this.authService.resetPassword(resetPasswordDto.hash, resetPasswordDto.password);
	}

	@ApiBearerAuth()
	@SerializeOptions({ groups: ['me'] })
	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.OK)
	public me(@Request() request: Request & { user: User }): Promise<NullableType<User>> {
		return this.authService.me(request.user);
	}

	@ApiBearerAuth()
	@SerializeOptions({ groups: ['me'] })
	@Patch('me')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.OK)
	public update(@Request() request: Request & { user: User }, @Body() updateArgs: AuthUpdateDTO): Promise<NullableType<User>> {
		return this.authService.update(request.user, updateArgs);
	}

	@ApiBearerAuth()
	@Delete('me')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.NO_CONTENT)
	public async delete(@Request() request: Request & { user: User }): Promise<void> {
		return this.authService.softDelete(request.user);
	}
}
