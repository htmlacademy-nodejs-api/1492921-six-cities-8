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
            # печатает этот текст
            ${chalk.cyanBright.italic('--help')}
            # выводит номер версии
            ${chalk.cyanBright.italic('--version')}
            # импортирует данные из *.tsv файлов
            ${chalk.cyanBright.italic('--import')} ${chalk.greenBright.italic('<usersFile> <offersFile> <login> <password> <host> <dbname> <salt>')}
                ${chalk.greenBright.italic('<usersFile>')}  — файл c пользователями.
                ${chalk.greenBright.italic('<offersFile>')} — файл с предложениями аренды.
                ${chalk.greenBright.italic('<login>')}      — Логин пользователя для соединения с базой данных.
                ${chalk.greenBright.italic('<password>')}   — Пароль пользователя для соединения с базой данных.
                ${chalk.greenBright.italic('<host>')}       — Адрес сервера, на котором расположена базы данных.
                ${chalk.greenBright.italic('<dbname>')}     — Имя базы данных.
                ${chalk.greenBright.italic('<salt>')}       — Соль (символы) для шифрования паролей пользователей.
            # генерирует *.tsv файлы
            ${chalk.cyanBright.italic('--generate')} ${chalk.greenBright.italic('<count> <usersFile> <offersFile> <url>')}
                ${chalk.greenBright.italic('<count>')}      — количество предложений для генерации.
                ${chalk.greenBright.italic('<usersFile>')}  — файл для записи пользователей.
                ${chalk.greenBright.italic('<offersFile>')} — файл для записи предложений аренды.
                ${chalk.greenBright.italic('<url>')}        — URL сервиса (JSON-server).
      `);
  }
}
