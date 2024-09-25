import { EMPTY_AVATAR } from '../../../const/data.js';
import { validateEmail } from '../../../utils/inet.js';
import { TSVFileReader } from './tsv-file-reader.js';

export class TSVUsersFileReader extends TSVFileReader {

  protected endFileRead() {
    super.endFileRead();
    this.emit('endUsers');
  }

  parseLineToObject(line: string): boolean {
    const items = line.split('\t');
    if (items.length !== 5 && items.length !== 4) {
      console.error('Файл с пользователями не корректный (в одной строке должно быть от 4 до 5 элементов).');
      return false;
    }
    const [
      name,
      email,
      password,
      isPro,
      avatarUrl
    ] = items;
    if (!validateEmail(email)) {
      throw new Error(`Файл с пользователями не корректный (email: ${email} недопустим).`);
    }
    if ('True~False~'.includes(`${isPro}~`)) {
      console.error('FФайл с пользователями не корректный (4-е поле isPro должно быть True или False).');
      return false;
    }
    const user = {
      name,
      email,
      password,
      isPro: isPro === 'True',
      avatarUrl: avatarUrl ?? EMPTY_AVATAR
    };
    this.emit('line', user);
    return true;
  }
}
