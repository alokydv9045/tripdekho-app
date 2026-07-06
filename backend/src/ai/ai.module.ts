import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenAIService } from './openai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [HttpModule],
  controllers: [AiController],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class AiModule {}
