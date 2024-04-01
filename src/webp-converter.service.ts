import { Injectable } from '@nestjs/common';
import { execFileSync } from 'child_process';
import path from 'path';
import { InvalidOptionsError, WebpConverterOptions } from './options';

@Injectable()
export class WebpConverterService {
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
    options?: Partial<WebpConverterOptions>,
  ): Promise<void> {
    const defaultOptions: WebpConverterOptions = {
      quality: 80,
      multiThread: true,
      lossless: false,
      compressionMethod: 6,
    };

    const args = [
      input,
      ...this.mapOptions(
        !!options ? { ...defaultOptions, ...options } : defaultOptions,
      ),
      '-o',
      output,
    ];

    execFileSync(this.getBinPath(), args);
  }

  private getBinPath(): string {
    const vendorPath = '../vendor';
    const paths = {
      win32: {
        x64: `${vendorPath}/win32/x64/cwebp.exe`,
      },
      linux: {
        x64: `${vendorPath}/linux/x64/cwebp`,
      },
      darwin: {
        arm64: `${vendorPath}/osx/arm64/cwebp`,
        x64: `${vendorPath}/osx/x64/cwebp`,
      },
    };

    return path.join(__dirname, paths[process.platform][process.arch]);
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
