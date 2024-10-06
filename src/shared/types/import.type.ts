import { TSVFileReader } from '../libs/file-reader/tsv-file-reader.js';
import { TOffer } from './offer.type.js';
import { TUser } from './user.type.js';

type TImportObjects = TUser | TOffer;

type TImportFile = {
  fileName: string;
  content: string;
  paramNumber: number;
  onImportedLine: (obj: TImportObjects, resolve: () => void) => Promise<void>;
  getFileReader: (fileName: string) => TSVFileReader;
};

export type { TImportObjects, TImportFile };
