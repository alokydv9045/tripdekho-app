import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { ItineraryParamsDto } from './dto/ai.dto';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openai: OpenAI | null = null;
  private readonly isOpenRouter: boolean = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'placeholder' && apiKey !== '') {
      const config: any = { apiKey };
      this.isOpenRouter = apiKey.startsWith('sk-or-');
      if (this.isOpenRouter) {
        config.baseURL = 'https://openrouter.ai/api/v1';
        config.defaultHeaders = {
          'HTTP-Referer': 'https://tripdekho.com',
          'X-Title': 'TripDekho',
        };
      }
      this.openai = new OpenAI(config);
    }
  }

  async generateItinerary(params: ItineraryParamsDto): Promise<any> {
    this.logger.log(`Generating itinerary for ${params.destination}`);

    if (!this.openai) {
      this.logger.warn(
        'OPENAI_API_KEY is not configured. Falling back to dynamic mock itinerary.',
      );
      return this.getMockItinerary(params);
    }

    const prompt = `Create a ${params.days}-day ${params.budget} travel itinerary for ${params.destination}. 
    Focus on these interests: ${params.interests.join(', ')}.
    Return the response as a JSON array where each element represents a day, containing 'day', 'title', and an array of 'activities'.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.isOpenRouter ? 'openai/gpt-4o' : 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert travel planner that responds ONLY in JSON format. Provide the root object as {"itinerary": [ ... ]}',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('OpenAI returned empty content');
      }

      return JSON.parse(content);
    } catch (e) {
      this.logger.error(
        `Error processing AI response: ${e.message}. Falling back to dynamic mock itinerary.`,
      );
      return this.getMockItinerary(params);
    }
  }

  private getMockItinerary(params: ItineraryParamsDto) {
    const itinerary = [];
    for (let i = 1; i <= params.days; i++) {
      itinerary.push({
        day: i,
        title: `Exploring ${params.destination} - Day ${i}`,
        activities: [
          `Morning walking tour of key ${params.interests?.[0] || 'landmarks'} in ${params.destination}.`,
          `Lunch at a highly rated local restaurant matching a ${params.budget} budget.`,
          `Afternoon visit to local cultural sites focusing on ${params.interests?.length ? params.interests.join(', ') : 'sightseeing'}.`,
          `Evening relaxation and dinner in the city center.`,
        ],
      });
    }
    return { itinerary };
  }

  async generateRouteMap(locations: string[], title: string): Promise<string> {
    this.logger.log(`Generating route map for ${title}`);

    if (!this.openai) {
      this.logger.warn('OPENAI_API_KEY not configured. Mocking route map URL.');
      return '/mountains.png';
    }

    try {
      const prompt = `Create a whimsical, flat vector infographic map illustration on a pale yellow background. It should trace a path connecting these locations: ${locations.join(', ')}. Use simple nature icons like pine trees and mountains. The overall vibe should be similar to a cute travel map graphic. NO TEXT on the image.`;
      
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      });

      if (!response || !response.data || response.data.length === 0) {
         throw new Error('No image returned from OpenAI');
      }

      const imageUrl = response.data[0].url;
      if (!imageUrl) throw new Error('No image URL returned from OpenAI');

      // Download the image locally to persist it
      const axios = require('axios');
      const fs = require('fs');
      const path = require('path');

      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream',
      });

      const filename = `routemap-${Date.now()}.png`;
      // Assuming project root has an "uploads" folder mapped to static route
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const writer = fs.createWriteStream(filePath);
      
      imageResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_API_URL')?.replace('/api/v2', '') || 'http://localhost:5001';
      return `${baseUrl}/uploads/${filename}`;
    } catch (e) {
      this.logger.error(`Error generating route map: ${e.message}`);
      return '/mountains.png';
    }
  }

  async generateTripImage(title: string, destination: string, vibe: string): Promise<string> {
    this.logger.log(`Generating trip image for ${title}`);

    if (!this.openai) {
      this.logger.warn('OPENAI_API_KEY not configured. Mocking trip image URL.');
      return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800';
    }

    try {
      const prompt = `A breathtaking, cinematic, and professional travel photography shot for a trip titled "${title}" located in ${destination}. The overall vibe is ${vibe}. The image should be highly realistic, stunning lighting, no text, no borders. Suitable for a premium travel agency website header.`;
      
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      });

      if (!response || !response.data || response.data.length === 0) {
         throw new Error('No image returned from OpenAI');
      }

      const imageUrl = response.data[0].url;
      if (!imageUrl) throw new Error('No image URL returned from OpenAI');

      // Download the image locally to persist it
      const axios = require('axios');
      const fs = require('fs');
      const path = require('path');

      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream',
      });

      const filename = `trip-${Date.now()}.png`;
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const writer = fs.createWriteStream(filePath);
      
      imageResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_API_URL')?.replace('/api/v2', '') || 'http://localhost:5001';
      return `${baseUrl}/uploads/${filename}`;
    } catch (e) {
      this.logger.error(`Error generating trip image: ${e.message}`);
      return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800';
    }
  }
  async generateTripDetails(title: string, destination?: string): Promise<{
    description: string;
    shortDescription: string;
    catchphrase: string;
  }> {
    this.logger.log(`Generating trip details for: ${title}`);

    const fallback = {
      description: `${title} is an unforgettable journey that takes you through some of the most breathtaking landscapes and experiences ${destination ? 'in ' + destination : ''}. This carefully curated trip blends adventure, culture, and serenity into a seamless travel experience you will cherish forever.`,
      shortDescription: `Discover the magic of ${destination || 'this incredible destination'} on an unforgettable journey filled with adventure and culture.`,
      catchphrase: `Your ${title} adventure starts here.`,
    };

    if (!this.openai) {
      this.logger.warn('OPENAI_API_KEY not configured. Using fallback trip details.');
      return fallback;
    }

    try {
      const prompt = `You are a professional travel copywriter for a premium Indian travel agency called TripDekho.
Given the trip title: "${title}"${destination ? ` in ${destination}` : ''}.

INSTRUCTIONS:
1. First, deeply analyze the location and context implied by the title and destination. Identify unique geographical features, cultural significance, famous landmarks, or local experiences associated with this place.
2. Based on this analysis, generate highly specific and tailored travel copy. DO NOT use generic phrases that could apply to any trip.
3. Generate the following in JSON format:
- "description": A compelling, immersive 2-3 sentence trip description (max 400 chars) in English that highlights the SPECIFIC details of this location.
- "shortDescription": A concise 1-sentence teaser (max 120 chars) mentioning a specific feature.
- "catchphrase": A punchy, memorable marketing tagline (max 60 chars).`;

      const response = await this.openai.chat.completions.create({
        model: this.isOpenRouter ? 'openai/gpt-4o' : 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert travel copywriter with deep knowledge of geography and local culture. Always respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 400,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return fallback;

      // Clean up potential markdown formatting from OpenAI response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const cleanContent = jsonMatch ? jsonMatch[0] : content;

      const parsed = JSON.parse(cleanContent);
      return {
        description: parsed.description || fallback.description,
        shortDescription: parsed.shortDescription || fallback.shortDescription,
        catchphrase: parsed.catchphrase || fallback.catchphrase,
      };
    } catch (e) {
      this.logger.error(`Error generating trip details: ${e.message}. Using fallback.`);
      return fallback;
    }
  }
}
