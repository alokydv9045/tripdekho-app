import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

export interface GstValidationResult {
  isValid: boolean;
  businessName?: string;
  registrationDate?: string;
  state?: string;
  rawResponse?: any;
}

@Injectable()
export class GstValidator {
  private readonly logger = new Logger(GstValidator.name);
  private readonly apiKey = process.env.GST_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async validate(gstNumber: string): Promise<GstValidationResult> {
    this.logger.log(`Validating GST number: ${gstNumber}`);

    if (!this.apiKey) {
      this.logger.warn(
        'GST_API_KEY is not configured. Falling back to local regex validation only.',
      );
      return {
        isValid:
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            gstNumber,
          ),
        rawResponse: {
          note: 'Offline regex validation due to missing API key',
        },
      };
    }

    try {
      const response = await firstValueFrom(
        this.httpService
          .post(
            'https://api.mastergst.com/gstverify',
            { gstin: gstNumber },
            { headers: { Authorization: `Bearer ${this.apiKey}` } },
          )
          .pipe(
            catchError((error) => {
              this.logger.error(`GST API failed: ${error.message}`);
              throw new Error('GST Verification API Failed');
            }),
          ),
      );

      const data = response.data;
      if (data && data.status === 'Active') {
        return {
          isValid: true,
          businessName: data.tradename || data.legalname,
          registrationDate: data.rgdt,
          state: data.pradr?.addr?.stcd,
          rawResponse: data,
        };
      }

      return {
        isValid: false,
        rawResponse: data,
      };
    } catch (err) {
      return {
        isValid: false,
        rawResponse: { error: err.message },
      };
    }
  }
}
