import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Forgot } from './entity';
import { ForgotService } from './service';

@Module({
	imports: [TypeOrmModule.forFeature([Forgot])],
	providers: [ForgotService],
	exports: [ForgotService],
})
export class ForgotModule {}
