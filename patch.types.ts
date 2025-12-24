interface Dota2Patch {
  patch_number: string;
  patch_name: string;
  patch_timestamp: number;
}

interface Dota2Patches {
  patches: Array<Dota2Patch>;
}

export type { Dota2Patch, Dota2Patches };
