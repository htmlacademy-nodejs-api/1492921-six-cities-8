import { ICommand } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements ICommand {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
    Программа для подготовки данных для REST API сервера.
        ${chalk.white.bold('Пример:')}
            ${chalk.yellow('main.cli.js')} ${chalk.cyan('--<command>')} [${chalk.greenBright.italic('arguments')}]
        ${chalk.white.bold('Команды:')}
            ${chalk.cyanBright.italic('--version')}                                                # выводит номер версии
            ${chalk.cyanBright.italic('--help')}                                                   # печатает этот текст
            ${chalk.cyanBright.italic('--import')} ${chalk.greenBright.italic('<usersFile> <offersFile>')}                        # импортирует данные из *.tsv файлов
            ${chalk.cyanBright.italic('--generate')} ${chalk.greenBright.italic('<count> <usersFile> <offersFile> <url>')}        # генерирует *.tsv файлы
                ${chalk.greenBright.italic('<count>')}      — количество предложений для генерации.
                ${chalk.greenBright.italic('<usersFile>')}  — файл для записи пользоватлей.
                ${chalk.greenBright.italic('<offersFile>')} — файл для записи предложений.
                ${chalk.greenBright.italic('<url>')}        — URL сервиса (JSON-server).
      `);
  }
}
