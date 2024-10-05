import { EMPTY_AVATAR } from '../../../const/index.js';
import { validateEmail } from '../../../utils/inet.js';
import { TSVFileReader } from './tsv-file-reader.js';

export class TSVUsersFileReader extends TSVFileReader {

  async parseLineToObject(line: string): Promise<boolean> {
    const items = line.split('\t');
    if (items.length !== 4 && items.length !== 3) {
      console.error('Файл с пользователями не корректный (в одной строке должно быть от 3 до 4 элементов).');
      return false;
    }
    const [
      name,
      email,
      isPro,
      avatarUrl
    ] = items;
    if (!validateEmail(email)) {
      throw new Error(`Файл с пользователями не корректный (email: ${email} недопустим).`);
    }
    if ('True~False~'.includes(`${isPro}~`)) {
      console.error('FФайл с пользователями не корректный (3-е поле isPro должно быть True или False).');
      return false;
    }
    const parsedUser = {
      name,
      email,
      isPro: isPro === 'True',
      avatarUrl: avatarUrl ?? EMPTY_AVATAR
    };

    await new Promise((resolve) => {
      this.emit('line', parsedUser, resolve);
    });
    return true;
  }
}
