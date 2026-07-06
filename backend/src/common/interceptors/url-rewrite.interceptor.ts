import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * UrlRewriteInterceptor
 *
 * Recursively rewrites all MinIO/storage URLs that contain an IP address or
 * localhost hostname to a relative `/storage/` path, which is then proxied by
 * Nginx to the MinIO instance.
 *
 * This eliminates Mixed Content (HTTP → HTTPS) browser errors completely by
 * ensuring raw `http://IP:PORT/bucket/...` URLs never reach the client.
 *
 * Example:
 *   http://195.35.22.92:9000/tripdekho-media/photo.jpg
 *   → /storage/tripdekho-media/photo.jpg
 */
@Injectable()
export class UrlRewriteInterceptor implements NestInterceptor {
  private static readonly IP_URL_PATTERN =
    /^https?:\/\/(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/;
  private static readonly LOCALHOST_URL_PATTERN =
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.rewriteUrls(data)));
  }

  private rewriteUrls(value: any): any {
    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {
      return this.rewriteUrl(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.rewriteUrls(item));
    }

    if (typeof value === 'object') {
      if (value instanceof Date || value instanceof Buffer) return value;

      // Mutate in place to preserve class prototypes (e.g. for TypeORM entities)
      for (const key of Object.keys(value)) {
        value[key] = this.rewriteUrls(value[key]);
      }
      return value;
    }

    return value;
  }

  private rewriteUrl(url: string): string {
    try {
      if (
        UrlRewriteInterceptor.IP_URL_PATTERN.test(url) ||
        UrlRewriteInterceptor.LOCALHOST_URL_PATTERN.test(url)
      ) {
        const parsed = new URL(url);
        return `/storage${parsed.pathname}${parsed.search}`;
      }
    } catch {
      // Not a valid URL, return as-is
    }
    return url;
  }
}
