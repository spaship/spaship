import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'spaship',
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, JwtService],
  exports: [AuthService, JwtAuthGuard, JwtService]
})
export class AuthModule {}
