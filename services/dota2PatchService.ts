import type { Dota2Patches } from "@/patch.types.ts";
import type { IPatchRepository } from "@repositories";
import type { IPatchService } from "./patchService.ts";
import type { Patch } from "@/pg.types.ts";
import type { Client } from "discord.js";

import {
  ContainerBuilder,
  MessageFlags,
  TextChannel,
  TextDisplayBuilder,
} from "discord.js";
import logger from "@logging";
import { dota_2_api } from "@/api.constants.ts";
import { dota_role } from "@/constants.ts";
import { ms_in_second } from "@/utils/time.ts";

export class Dota2PatchService implements IPatchService {
  private readonly _patch_repository: IPatchRepository;

  constructor(patch_repository: IPatchRepository) {
    this._patch_repository = patch_repository;
  }

  async checkPatch(client: Client): Promise<void> {
    const current_patch = await this.getCurrentPatch("dota2");
    const latest_patches = await this.getLatestPatch(current_patch.patch_url);
    const latest_patch =
      latest_patches.patches.sort((pa, pb) =>
        pb.patch_timestamp - pa.patch_timestamp
      )[0];

    if (
      new Date(latest_patch.patch_timestamp * ms_in_second) <=
        current_patch.latest_version_date
    ) {
      return;
    }

    logger.log_info(
      `Found new version of Dota 2, ${latest_patch.patch_number}.`,
    );

    client.guilds.cache.each(async (g) => {
      const notify_channel = g.channels.cache
        .find((
          c,
        ) => c.isTextBased() && (<TextChannel> c).position === 0) as
          | TextChannel
          | undefined;

      if (!notify_channel) {
        logger.log_warning("Couldn't find text channel in guild", g.name);
        return;
      }

      const role_to_notify = g.roles.cache.get(dota_role);
      const dota_2_container = new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent(
              `### ${
                role_to_notify ? `<@&${role_to_notify?.id}>, ` : ""
              } Dota 2 Version [${latest_patch.patch_number}](${dota_2_api.patch_url}${latest_patch.patch_number}) is available!`,
            ),
        );

      await notify_channel.send({
        components: [dota_2_container],
        flags: MessageFlags.IsComponentsV2,
      });

      await this._patch_repository.updatePatchByGameId(
        "dota2",
        latest_patch.patch_timestamp,
        latest_patch.patch_number,
      );
    });
  }

  private async getCurrentPatch(game_id: string): Promise<Patch> {
    const current_patch = await this._patch_repository.getPatchByGameId(
      game_id,
    );

    if (!current_patch) {
      throw Error(`Couldn't retrieve current patch information for ${game_id}`);
    }

    return current_patch;
  }

  private async getLatestPatch(patch_url: string): Promise<Dota2Patches> {
    try {
      const resp = await fetch(patch_url);
      const patches_from_sot = await resp.json();

      return patches_from_sot as Dota2Patches;
    } catch (e) {
      logger.log_error("Fetch failed on Dota 2 endpoint", e);

      throw e;
    }
  }
}
