export abstract class IFormatExceptionMessage {
  message: string;

  codeError?: number;
}

export abstract class IException {
  abstract badRequestException(data: IFormatExceptionMessage): void;

  abstract internalServerErrorException(data?: IFormatExceptionMessage): void;

  abstract forbiddenException(data?: IFormatExceptionMessage): void;

  abstract UnauthorizedException(data?: IFormatExceptionMessage): void;
}
