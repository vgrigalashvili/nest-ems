import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { OrNeverType } from '../../common/utils/types';
import { JwtPayloadType } from '../../common/utils/types/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(protected jwtService: JwtService, protected configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('auth.secret'),
		});
	}

	public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
		if (!payload.id) {
			throw new UnauthorizedException();
		}

		return payload;
	}
}
