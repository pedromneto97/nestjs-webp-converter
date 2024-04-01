import { Test, TestingModule } from '@nestjs/testing';
import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { InvalidOptionsError } from './options';
import { WebpConverterService } from './webp-converter.service';

jest.mock('child_process');

describe('WebpConverterService', () => {
  let service: WebpConverterService;
  const output = __dirname + '/../test/test.webp';
  const input = __dirname + '/../test/test.jpg';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebpConverterService],
    }).compile();

    service = module.get<WebpConverterService>(WebpConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const getExecutablePath = () => {
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
  };

  it('should convert an image to WebP format', async () => {
    await expect(service.convert(input, output)).resolves.not.toThrow();

    expect(existsSync(output)).toBe(true);

    expect(execFileSync).toHaveBeenCalledWith(getExecutablePath(), [
      input,
      '-q',
      '80',
      '-mt',
      '-m',
      '6',
      '-o',
      output,
    ]);
  });

  describe('mapOptions', () => {
    describe('quality', () => {
      it('should throw an error if the quality is less than zero', async () => {
        await expect(() =>
          service.convert(input, output, { quality: -1 }),
        ).rejects.toEqual(new InvalidOptionsError('quality'));
      });

      it('should throw an error if the quality is greater than 100', async () => {
        await expect(() =>
          service.convert(input, output, { quality: 101 }),
        ).rejects.toEqual(new InvalidOptionsError('quality'));
      });
    });

    describe('compressionMethod', () => {
      it('should throw an error if the compression method is less than zero', async () => {
        await expect(() =>
          service.convert(input, output, { compressionMethod: -1 }),
        ).rejects.toEqual(new InvalidOptionsError('compressionMethod'));
      });

      it('should throw an error if the compression method is greater than 6', async () => {
        await expect(() =>
          service.convert(input, output, { compressionMethod: 7 }),
        ).rejects.toEqual(new InvalidOptionsError('compressionMethod'));
      });
    });

    it('should use lossless if provided', async () => {
      await expect(
        service.convert(input, output, { lossless: true }),
      ).resolves.not.toThrow();

      expect(execFileSync).toHaveBeenCalledWith(getExecutablePath(), [
        input,
        '-q',
        '80',
        '-mt',
        '-lossless',
        '-m',
        '6',
        '-o',
        output,
      ]);
    });
  });
});
