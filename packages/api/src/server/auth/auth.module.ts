import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataServicesModule } from 'src/repository/data-services.module';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { ApikeyFactory } from '../api-key/service/apikey.factory';
import { AuthenticationGuard } from './auth.guard';

@Module({
  imports: [DataServicesModule],
  providers: [ExceptionsService, AuthenticationGuard, JwtService, ApikeyFactory],
  exports: [AuthenticationGuard, JwtService]
})
export class AuthModule {}
