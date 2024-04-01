export interface WebpConverterOptions {
  /**
   * Quality of the output image, between 0 and 100. (default: 80)
   */
  quality: number;
  /**
   * Use multi-threading to encode images. (default: true)
   */
  multiThread: boolean;
  /**
   * Use lossless compression. (default: false)
   */
  lossless: boolean;
  /**
   * Select the compression method to use, between 0 (fastest) and 6 (slowest). (default: 6)
   */
  compressionMethod: number;
}

export class InvalidOptionsError extends Error {
  constructor(option: string) {
    super(`The option ${option} is invalid.`);
  }
}
