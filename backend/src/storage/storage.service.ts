import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export interface StorageUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes: number;
}

export interface StorageUploadOptions {
  folder: string;
  /** Max file size in bytes. Default: 10MB */
  maxFileSize?: number;
  /** Allowed MIME types. Default: image/* */
  allowedMimeTypes?: string[];
  /** Transformation parameters (ignored for standard S3 unless using a proxy/resizer) */
  transformation?: Record<string, any>;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private readonly bucketName = process.env.S3_BUCKET_NAME || 'tripdekho-media';
  private readonly endpointUrl =
    process.env.S3_ENDPOINT || 'http://localhost:9000';
  // Use public URL for generating frontend links. If empty, falls back to endpointUrl.
  private readonly publicUrl = process.env.S3_PUBLIC_URL || this.endpointUrl;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION || 'us-east-1',
      endpoint: this.endpointUrl,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      },
      // Force path style for MinIO (e.g., http://localhost:9000/bucket/file instead of http://bucket.localhost:9000/file)
      forcePathStyle: true,
    });
  }

  /**
   * Upload an image file (from Multer) to MinIO/S3.
   */
  async uploadImage(
    file: Express.Multer.File,
    options: StorageUploadOptions,
  ): Promise<StorageUploadResult> {
    const {
      folder,
      maxFileSize = 10 * 1024 * 1024, // 10MB default
      allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    } = options;

    if (file.size > maxFileSize) {
      const maxMB = Math.round(maxFileSize / (1024 * 1024));
      throw new BadRequestException(
        `File size exceeds the ${maxMB}MB limit. Please upload a smaller file.`,
      );
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed. Accepted: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const extension =
      path.extname(file.originalname) || `.${file.mimetype.split('/')[1]}`;
    const filename = `${uuidv4()}${extension}`;
    const key = folder ? `${folder}/${filename}` : filename;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      const fileUrl = `${this.publicUrl}/${this.bucketName}/${key}`;

      this.logger.log(`Uploaded to S3/MinIO: ${key} (${file.size} bytes)`);

      return {
        url: fileUrl,
        secureUrl: fileUrl,
        publicId: key,
        bytes: file.size,
        format: extension.replace('.', ''),
      };
    } catch (error) {
      this.logger.error(`S3 upload failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Image upload failed: ${error.message}`);
    }
  }

  /**
   * Upload a raw buffer to S3/MinIO.
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename?: string,
  ): Promise<StorageUploadResult> {
    const key = filename ? `${folder}/${filename}` : `${folder}/${uuidv4()}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        // Using octet-stream as fallback, can be adjusted based on buffer content type
        ContentType: 'application/octet-stream',
      });

      await this.s3Client.send(command);

      const fileUrl = `${this.publicUrl}/${this.bucketName}/${key}`;

      return {
        url: fileUrl,
        secureUrl: fileUrl,
        publicId: key,
        bytes: buffer.length,
      };
    } catch (error) {
      this.logger.error(`S3 buffer upload failed: ${error.message}`);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Delete a file from S3/MinIO by its publicId (which is the object Key).
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: publicId,
      });

      await this.s3Client.send(command);
      this.logger.log(`Deleted from S3/MinIO: ${publicId}`);
      return true;
    } catch (error) {
      this.logger.error(`S3 delete failed for ${publicId}: ${error.message}`);
      return false;
    }
  }

  /**
   * Get URL for a given publicId. Since we don't have built-in transformations like Cloudinary,
   * we just return the raw URL.
   */
  getOptimizedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
    },
  ): string {
    return `${this.publicUrl}/${this.bucketName}/${publicId}`;
  }
}
