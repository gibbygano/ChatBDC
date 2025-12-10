import type { Media, MediaDirectory } from "@/types.ts";
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

const registerMedia = async (
  directory: string,
  callback: (media: Media) => void,
) => {
  const foldersPath = join(Deno.cwd(), directory);

  for await (const dirEntry of walk(foldersPath)) {
    if (dirEntry.isFile) {
      const path_from_directory = dirEntry.path.split(directory)[1];
      const media_directory: MediaDirectory = {
        name: dirEntry.path.split("/").slice(-2, -1)[0],
        path: dirEntry.path.substring(0, dirEntry.path.lastIndexOf("/")),
        pathLabel: path_from_directory.substring(
          0,
          path_from_directory.lastIndexOf("/"),
        ) || "/",
      };

      callback({
        short_name: dirEntry.name.split(".")[0],
        full_name: dirEntry.name,
        path: dirEntry.path,
        directory: media_directory,
      });
    }
  }
};

export { register, registerMedia };
