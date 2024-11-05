import { UserFieldsInLine } from '../../../const/index.js';
import { validateEmail } from '../../helpers/index.js';
import { TSVFileReader } from './tsv-file-reader.js';

export class TSVUsersFileReader extends TSVFileReader {
  parseLineToObject<T>(line: string): T {
    const items = line.split('\t');
    if (
      items.length !== UserFieldsInLine.count &&
      items.length !== UserFieldsInLine.required
    ) {
      throw new Error(
        `Файл с пользователями не корректный (в одной строке должно быть от ${UserFieldsInLine.required} до ${UserFieldsInLine.count} значений, разделенных табуляцией).`
      );
    }
    const [name, email, isPro, avatarUrl] = items;
    if (!validateEmail(email)) {
      throw new Error(
        `Файл с пользователями не корректный (email: ${email} недопустим).`
      );
    }
    if ('True~False~'.includes(`${isPro}~`)) {
      throw new Error(
        'Файл с пользователями не корректный (3-е поле isPro должно быть True или False).'
      );
    }
    return {
      name,
      email,
      avatarUrl: avatarUrl, // ?? EMPTY_AVATAR,
      password: '',
      isPro: isPro === 'True',
    } as T;
  }
}
