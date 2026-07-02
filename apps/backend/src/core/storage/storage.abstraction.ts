export interface StorageFile {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface StorageService {
  upload(path: string, file: StorageFile): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}
