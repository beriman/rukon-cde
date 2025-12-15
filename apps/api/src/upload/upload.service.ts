import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get('AWS_REGION') || 'ap-southeast-1',
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
        this.bucketName = this.configService.get('AWS_S3_BUCKET') || 'rukon-hse-files';
    }

    /**
     * Generate presigned URL for client-side upload
     * Client uploads directly to S3 using this URL
     */
    async getPresignedUploadUrl(fileName: string, fileType: string): Promise<{ uploadUrl: string; fileUrl: string }> {
        const key = `incidents/${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour

        const fileUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION') || 'ap-southeast-1'}.amazonaws.com/${key}`;

        return { uploadUrl, fileUrl };
    }

    /**
     * Get multiple presigned URLs for batch upload
     */
    async getPresignedUploadUrls(files: { fileName: string; fileType: string }[]): Promise<{ uploadUrl: string; fileUrl: string }[]> {
        return Promise.all(
            files.map(file => this.getPresignedUploadUrl(file.fileName, file.fileType))
        );
    }
}
