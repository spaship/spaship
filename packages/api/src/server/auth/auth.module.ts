import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataServicesModule } from 'src/repository/data-services.module';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { AuthenticationGuard } from './auth.guard';

@Module({
  imports: [DataServicesModule],
  providers: [ExceptionsService, AuthenticationGuard, JwtService],
  exports: [AuthenticationGuard, JwtService]
})
export class AuthModule {}
