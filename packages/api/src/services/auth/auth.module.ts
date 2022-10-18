import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from "./jwt.contrains";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'spaship',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, JwtService],
  exports: [AuthService, JwtAuthGuard, JwtService],
})
export class AuthModule { }
