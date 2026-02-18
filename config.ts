export interface AppConfig {
  discordBotToken: string;
  discordBotClientId: string;
  discordServerId: string;
  is_development: boolean;
  alert_user_id: string;
}

export function getAppConfig(): AppConfig {
  return <AppConfig> {
    discordBotToken: Deno.env.get("DISCORD_TOKEN"),
    discordBotClientId: Deno.env.get("DISCORD_BOT_CLIENT_ID"),
    discordServerId: Deno.env.get("SERVER_ID"),
    is_development: Deno.env.get("IS_DEVELOPMENT") ?? false,
    alert_user_id: Deno.env.get("ALERT_USER_ID"),
  };
}
