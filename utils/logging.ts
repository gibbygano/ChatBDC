// deno-lint-ignore-file no-explicit-any
import { brightCyan, brightRed, brightYellow } from "@coven/terminal";
import { ClientService } from "../services/clientService.ts";
import { getAppConfig } from "../config.ts";

const log_warning = (...args: any[]) =>
  console.warn(...args.map((a) => brightYellow`${a}`));

const log_info = (...args: any[]) =>
  console.info(...args.map((a) => brightCyan`${a}`));

const log_time = (name: string) => {
  console.time(name);
  return { [Symbol.dispose]: () => console.timeEnd(name) };
};

const log_error = async (...args: any[]) => {
  console.error(...args.map((a) => brightRed`${a}`));

  const { alert_user_id } = getAppConfig();
  const client = ClientService.instance.client;
  const alert_user = await client.users.fetch(alert_user_id);

  await alert_user.send(args.join("\n"));
};

export default { log_warning, log_info, log_error, log_time };
