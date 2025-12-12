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

export type { PreparedStatement, QuoteCommand };
