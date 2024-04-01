import { Test, TestingModule } from '@nestjs/testing';
import { WebpConverterService } from './webp-converter.service';

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
});
