import { Injectable, Logger } from '@nestjs/common';
import { Once, On, Context, ContextOf } from '@globalart/nestcord';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  @Once('ready')
  onBotReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  }

  @On('warn')
  public onWarn(@Context() [info]: ContextOf<'warn'>) {
    this.logger.warn(info);
  }

  @On('error')
  public onError(@Context() [error]: ContextOf<'error'>) {
    this.logger.error(error);
  }

  @On('debug')
  public onDebug(@Context() [info]: ContextOf<'debug'>) {
    this.logger.debug(info);
  }
}
