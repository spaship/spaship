import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { AuthActionLookupDto } from '../dto';
import { AuthActionLookup } from '../entity';

@Injectable()
export class AuthActionLookupFactory {
  constructor(private readonly logger: LoggerService) {}

  createNewAuthActionLookup(createAuthActionLookupDto: AuthActionLookupDto): AuthActionLookup {
    const authActionLookup = new AuthActionLookup();
    authActionLookup.name = createAuthActionLookupDto.name;
    authActionLookup.resource = createAuthActionLookupDto.resource;
    authActionLookup.method = createAuthActionLookupDto.method;
    this.logger.log('AuthActionLookup', JSON.stringify(authActionLookup));
    return authActionLookup;
  }
}
