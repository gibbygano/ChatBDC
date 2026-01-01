// deno-lint-ignore-file no-explicit-any
import { brightRed, brightYellow, gray } from "@coven/terminal";

const log_warning = (...args: any[]) =>
  console.warn(...args.map((a) => brightYellow`${a}`));

const log_info = (...args: any[]) =>
  console.info(...args.map((a) => gray`${a}`));

const log_time = (name: string) => {
  console.time(name);
  return { [Symbol.dispose]: () => console.timeEnd(name) };
};

const log_error = (...args: any[]) =>
  console.error(...args.map((a) => brightRed`${a}`));

export default { log_warning, log_info, log_error, log_time };
