import { GatewayIntentBits, Partials } from 'discord.js';
import { NestCordModule } from '@globalart/nestcord';
import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configs from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@app/shared';
import { InitAppModule } from './init-app/init-app.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    NestCordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    }),
    ConfigModule.forRoot({ isGlobal: true, load: configs }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ ...configService.get('database') }),
    }),
    SharedModule,
    InitAppModule,
    TicketModule,
  ],
  providers: [BotGateway],
})
export class BotModule {}
