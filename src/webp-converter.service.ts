import { Injectable } from '@nestjs/common';
import BinWrapper from '@xhmikosr/bin-wrapper';
import path from 'path';
import { InvalidOptionsError, WebpConverterOptions } from './options';

@Injectable()
export class WebpConverterService {
  private bin: BinWrapper;

  constructor() {
    const url =
      'https://github.com/pedromneto97/nestjs-webp-converter/raw/main/vendor/';

    this.bin = new BinWrapper()
      .src(`${url}win/x64/cwebp.exe`, 'win32', 'x64')
      .src(`${url}linux/x64/cwebp`, 'linux', 'x64')
      .src(`${url}osx/arm64/cwebp`, 'darwin', 'arm64')
      .dest(path.join('vendor'))
      .use(process.platform === 'win32' ? 'cwebp.exe' : 'cwebp');

    this.bin.runCheck('--version');
  }

  /**
   * Convert an image to WebP format.
   *
   * @param input Input image path
   * @param output Output image path
   * @param options Conversion options
   */
  async convert(
    input: string,
    output: string,
    options: WebpConverterOptions = {
      quality: 80,
      multiThread: true,
      lossless: false,
      compressionMethod: 6,
    },
  ): Promise<void> {
    const args = [input, ...this.mapOptions(options), '-o', output];

    await this.bin.run(args);
  }

  private mapOptions(options: WebpConverterOptions): string[] {
    const args: string[] = [];
    if (options.quality < 0 || options.quality > 100) {
      throw new InvalidOptionsError('quality');
    } else {
      args.push('-q', options.quality.toString());
    }

    if (options.multiThread) {
      args.push('-mt');
    }
    if (options.lossless) {
      args.push('-lossless');
    }
    if (options.compressionMethod < 0 || options.compressionMethod > 6) {
      throw new InvalidOptionsError('compressionMethod');
    } else {
      args.push('-m', options.compressionMethod.toString());
    }

    return args;
  }
}
