import type { ChatInputCommandInteraction } from "discord.js";

import { ReminderType } from "@/types.ts";
import { create_reminder } from "@/utils/rollcall.ts";
import { join } from "@std/path";
import { image_directory } from "@/constants.ts";

const image_file = "d1006478-966374311.jpg";
const dota_role = "dotaboi";
const rsvp_label = "I spose";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const dota_minutes = interaction.options.getString("minutes");

  return await create_reminder(
    interaction,
    ReminderType.DOTA,
    dota_minutes,
    join(Deno.cwd(), image_directory, image_file),
    image_file,
    dota_role,
    rsvp_label,
  );
};

export { execute };
