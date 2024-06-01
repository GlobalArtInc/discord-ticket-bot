import { TicketRepository } from '@app/dal/repositories';
import { Button, ButtonContext, ComponentParam, Context } from '@globalart/nestcord';
import { Injectable, ParseIntPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  TextChannel,
} from 'discord.js';
import * as moment from 'moment';

@Injectable()
export class TicketService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ticketRepository: TicketRepository,
  ) {}

  @Button('ticket-bot/support-emit/create-ticket')
  async createTicket(@Context() [interaction]: ButtonContext) {
    await interaction.deferUpdate({ fetchReply: true });

    const categoryChannel = await interaction.guild.channels.fetch(
      this.configService.getOrThrow('discord.channel')
    );

    if (categoryChannel.type === ChannelType.GuildCategory) {
      const ticket = await this.ticketRepository.create({
        createdDate: moment().toDate(),
        creatorId: interaction.user.id,
      });

      const createdTicketChannel = await interaction.guild.channels.create({
        name: `ticket-${ticket.id}`,
        type: ChannelType.GuildText,
        parent: categoryChannel.id,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
          },
        ],
      }) as TextChannel;

      const row = this.createButtonsAfterCreatedTicket(ticket.id);
      const message = await createdTicketChannel.send({
        content: `<@${interaction.user.id}>, Welcome. Please ask your question and an admin will come back to you asap.`,
        components: [row],
      });

      await this.ticketRepository.updateOneById(ticket.id, {
        channelId: createdTicketChannel.id,
        messageId: message.id,
      });
    }
  }

  @Button('ticket-bot/support-emit/close-ticket/:ticketId')
  async handleCloseTicket(
    @ComponentParam('ticketId', ParseIntPipe) ticketId: number,
    @Context() [interaction]: ButtonContext,
  ) {
    const ticket = await this.ticketRepository.getOneById(ticketId);
    const message = await interaction.channel.messages.fetch(ticket.messageId);
    const row = this.createButtonsAfterClickOnCloseButton(ticketId);
    await interaction.deferUpdate();

    await message.edit({
      components: [row],
    });
  }

  @Button('ticket-bot/support-emit/close-ticket/:ticketId/agree')
  async handleAgreeCloseTicket(
    @ComponentParam('ticketId', ParseIntPipe) ticketId: number,
    @Context() [interaction]: ButtonContext,
  ) {
    const ticket = await this.ticketRepository.getOneById(ticketId);
    await interaction.message.edit({
      components: [],
    });

    await Promise.all([
      this.ticketRepository.updateOneById(ticketId, {
        closedAt: moment().toDate(),
        closedBy: interaction.user.id,
      }),
      interaction.channel.edit({
        name: `closed-${ticket.id}`,
        permissionOverwrites: [
          {
            id: ticket.creatorId,
            deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
          },
        ],
      }),
      interaction.channel.send({
        content: `Ticket has been closed by <@${interaction.user.id}>`,
      }),
    ]);
  }

  @Button('ticket-bot/support-emit/close-ticket/:ticketId/cancel')
  async handleCancelCloseTicket(
    @ComponentParam('ticketId', ParseIntPipe) ticketId: number,
    @Context() [interaction]: ButtonContext,
  ) {
    await interaction.deferUpdate();
    const ticket = await this.ticketRepository.getOneById(ticketId);
    const row = this.createButtonsAfterCreatedTicket(ticketId);
    const message = await interaction.channel.messages.fetch(ticket.messageId);

    if (message) {
      await message.edit({ components: [row] });
    }
  }

  private createButtonsAfterCreatedTicket(ticketId: number) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`ticket-bot/support-emit/close-ticket/${ticketId}`)
        .setLabel('Close ticket')
        .setStyle(ButtonStyle.Danger),
    );
  }

  private createButtonsAfterClickOnCloseButton(ticketId: number) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`ticket-bot/support-emit/close-ticket/${ticketId}/cancel`)
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`ticket-bot/support-emit/close-ticket/${ticketId}/agree`)
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger),
    );
  }
}
