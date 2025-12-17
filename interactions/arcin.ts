import type { ChatInputCommandInteraction } from "discord.js";

import { ReminderType } from "@/types.ts";
import { create_reminder } from "@/utils/rollcall.ts";
import { join } from "@std/path";
import { image_directory } from "@/constants.ts";

const image_file = "ARC-Raiders-Scrappy-Loot-Rooster.webp";
const arc_role = "rainerds";
const rsvp_label = "Wanna go together?";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const arc_minutes = interaction.options.getString("minutes");

  return await create_reminder(
    interaction,
    ReminderType.ARC,
    arc_minutes,
    join(Deno.cwd(), image_directory, image_file),
    image_file,
    arc_role,
    rsvp_label,
  );
};

export { execute };
