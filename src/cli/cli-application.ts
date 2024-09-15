import { ICommand } from './commands/command.interface.js';

type CommandCollection = Record<string, ICommand>;

export class CLIApplication {
  private commands: CommandCollection = {};

  public registerCommands(commandList: ICommand[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }
}
