import { Injectable, Logger } from '@nestjs/common';
import { isJSON } from 'class-validator';
import { ILogger } from './logger.abstract';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(this.getMessage(message, context, 'debug'), context);
    }
  }

  log(context: string, message: string) {
    super.log(this.getMessage(message, context, 'info'), context);
  }

  error(context: string, message: string, trace?: string) {
    super.error(this.getMessage(message, context, 'error'), trace, context);
  }

  warn(context: string, message: string) {
    super.warn(this.getMessage(message, context, 'warn'), context);
  }

  verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(this.getMessage(message, context, 'verbose'), context);
    }
  }

  private getMessage(message: string, context, level): any {
    const data = { level, context };
    if (!isJSON(message)) return JSON.stringify({ ...data, message });
    return message;
  }
}
