import { join } from "@std/path/join";
import { walk } from "@std/fs/walk";

const register = async <T>(
  directory: string,
  callback: (registrationEntity: T) => void,
) => {
  const foldersPath = join(Deno.cwd(), directory);

  for await (const dirEntry of walk(foldersPath)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".ts")) {
      const entity = (await import(dirEntry.path)).default;
      callback(entity);
    }
  }
};

export { register };
