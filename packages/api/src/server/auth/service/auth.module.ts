import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { jwtConstants } from '../jwt/jwt.contrains';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

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
