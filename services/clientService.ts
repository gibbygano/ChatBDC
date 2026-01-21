import { Client, GatewayIntentBits } from "discord.js";

export class ClientService {
  private static _instance: ClientService;
  private readonly _client: Client;

  private constructor() {
    this._client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
  }

  static get instance(): ClientService {
    if (!ClientService._instance) {
      ClientService._instance = new ClientService();
    }

    return ClientService._instance;
  }

  get client(): Client {
    return this._client;
  }
}
