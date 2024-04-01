import { Module } from '@nestjs/common';
import { WebpConverterService } from './webp-converter.service';

@Module({
  providers: [WebpConverterService],
  exports: [WebpConverterService],
})
export class WebpConverterModule {}
