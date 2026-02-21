import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folderId: string,
  ): Promise<string> {
    if (!file?.buffer) {
      throw new InternalServerErrorException('File buffer is missing');
    }

    if (!folderId) {
      throw new InternalServerErrorException(
        'Google Drive folder ID is not set',
      );
    }

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const response = await this.drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
      fields: 'id',
    });

    const fileId = response.data.id;

    if (!fileId) {
      throw new InternalServerErrorException('Failed to get file ID');
    }

    // Make file public
    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // 🔥 THIS IS THE IMPORTANT PART
    const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return directUrl;
  }
}
