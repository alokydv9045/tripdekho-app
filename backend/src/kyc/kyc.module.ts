import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GstValidator } from './providers/gst-validator.service';
import { RiskScoringService } from './risk/risk-scoring.service';

@Module({
  imports: [HttpModule],
  providers: [GstValidator, RiskScoringService],
  exports: [GstValidator, RiskScoringService],
})
export class KycModule {}
