import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { AuthActionDto } from '../auth-actions.dto';
import { AuthAction } from '../auth-actions.entity';

@Injectable()
export class AuthActionFactory {
  constructor(private readonly logger: LoggerService) {}

  createNewAuthAction(createAuthActionDto: AuthActionDto): AuthAction {
    const authAction = new AuthAction();
    authAction.name = createAuthActionDto.name;
    authAction.resource = createAuthActionDto.resource;
    authAction.method = createAuthActionDto.method;
    this.logger.log('AuthAction', JSON.stringify(authAction));
    return authAction;
  }
}
