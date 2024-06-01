import { ConfigRepository } from '@app/dal/repositories/config';
import { Context, SlashCommand, SlashCommandContext, TextCommand, TextCommandContext } from '@globalart/nestcord';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, PermissionsBitField } from 'discord.js';

@Injectable()
export class InitAppService {
  constructor(private readonly configRepository: ConfigRepository) {}

  @SlashCommand({
    name: 'init',
    description: 'Init app',
  })
  async execute(@Context() [interaction]: SlashCommandContext) {
    const member = interaction.member as GuildMember;

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No permissions' });
    }

    return interaction.reply({ components: [this.buttons()] });
  }

  private buttons() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket-bot/support-emit/create-ticket')
        .setLabel('Create ticket')
        .setEmoji('📩')
        .setStyle(ButtonStyle.Success),
    );
  }
}
