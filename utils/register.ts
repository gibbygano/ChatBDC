import { join } from "@std/path/join";
import { walk } from "@std/fs/walk";
import { Media } from "../types.ts";

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

const registerMedia = async (
  directory: string,
  callback: (media: Media) => void,
) => {
  const foldersPath = join(Deno.cwd(), directory);

  for await (const dirEntry of walk(foldersPath)) {
    if (dirEntry.isFile) {
      callback({
        name: dirEntry.name.split(".")[0],
        path: dirEntry.path,
        parentDir: dirEntry.path.split("/").slice(-2, -1)[0],
      });
    }
  }
};

export { register, registerMedia };
