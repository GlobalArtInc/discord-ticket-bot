import { registerAs } from '@nestjs/config';

export default registerAs(
  'discord',
  (): Record<string, unknown> => ({
    token: process.env.DISCORD_TOKEN,
    channel: process.env.DISCORD_CHANNEL,
    guild: process.env.DISCORD_GUILD,
  }),
);
