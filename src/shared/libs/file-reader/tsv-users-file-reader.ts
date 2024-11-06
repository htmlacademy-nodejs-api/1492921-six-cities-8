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
    if (!'true~false~'.includes(`${isPro}~`)) {
      throw new Error(
        `Файл с пользователями не корректный (3-е поле isPro = ${isPro} должно быть true или false).`
      );
    }
    return {
      name,
      email,
      avatarUrl: avatarUrl,
      password: '',
      isPro: isPro === 'true',
    } as T;
  }
}
