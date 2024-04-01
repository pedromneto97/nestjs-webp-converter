import { Test, TestingModule } from '@nestjs/testing';
import { WebpConverterService } from './webp-converter.service';
import { existsSync } from 'fs';

describe('WebpConverterService', () => {
  let service: WebpConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebpConverterService],
    }).compile();

    service = module.get<WebpConverterService>(WebpConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should convert an image to WebP format', async () => {
    const output = __dirname + '/../test/test.webp';

    await expect(
      service.convert(__dirname + '/../test/test.jpg', output),
    ).resolves.not.toThrow();

    expect(existsSync(output)).toBe(true);
  });
});
