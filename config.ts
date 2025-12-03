export interface AppConfig {
  discordBotToken: string;
  discordBotClientId: string;
  discordServerId: string;
}

export function getAppConfig(): AppConfig {
  return <AppConfig> {
    discordBotToken: Deno.env.get("DISCORD_TOKEN"),
    discordBotClientId: Deno.env.get("DISCORD_BOT_CLIENT_ID"),
    discordServerId: Deno.env.get("SERVER_ID"),
  };
}
