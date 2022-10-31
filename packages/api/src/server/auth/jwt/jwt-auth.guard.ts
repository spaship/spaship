import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const secret: string = this.getSecret();
    const bearerToken: string = context.getArgs()[0].headers["authorization"].split(" ")[1];
    const options: any = {
      secret: secret,
    };
    const check = this.jwtService.verify(bearerToken, options);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  getSecret() {
    const publicKey = "publicKey";

    if (publicKey && publicKey.trim().length > 0) {
      return this.formatAsPem(publicKey);
    }
  }

  formatAsPem(str) {
    const keyHeader = "-----BEGIN PUBLIC KEY-----";
    const keyFooter = "-----END PUBLIC KEY-----";
    let formatKey = "";
    if (str.startsWith(keyHeader) && str.endsWith(keyFooter)) {
      return str;
    }

    if (str.split("\n").length == 1) {
      while (str.length > 0) {
        formatKey += `${str.substring(0, 64)}\n`;
        str = str.substring(64);
      }
    }

    return `${keyHeader}\n${formatKey}${keyFooter}`;
  }
}
