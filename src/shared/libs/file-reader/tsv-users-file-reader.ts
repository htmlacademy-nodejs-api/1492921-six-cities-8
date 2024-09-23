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
      console.error('File with Users not correct (Items in line <> 5 or 4).');
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
      throw new Error(`File with Users not correct (email: ${email} not valid).`);
    }
    if ('True~False~'.includes(`${isPro}~`)) {
      console.error('File with Users not correct (isPro is not boolean).');
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
