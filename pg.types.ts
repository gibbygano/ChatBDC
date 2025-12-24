interface PreparedStatement {
  name: string;
  text: string;
  values: unknown[];
}

interface QuoteCommand {
  command: {
    quotes: Array<string>;
  };
}

interface Patch {
  game: string;
  latest_version: string;
  latest_version_date: number;
  patch_url: string;
}

export type { Patch, PreparedStatement, QuoteCommand };
