type TParsedCommand = Record<string, string[]>

export class CommandParser {
  static parse(cliArguments: string[]): TParsedCommand {
    const parsedCommand: TParsedCommand = {};
    let currentCommand = '';

    for (const argument of cliArguments) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = [];
        currentCommand = argument;
      } else if (currentCommand && argument) {
        parsedCommand[currentCommand].push(argument);
      }
    }

    return parsedCommand;
  }
}
