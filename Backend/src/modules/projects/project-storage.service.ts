import { Injectable, NotFoundException } from '@nestjs/common';
import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';

export interface StoredFile {
  fileUrl: string;
  contentType: string;
}

@Injectable()
export class ProjectStorageService {
  private readonly containerName = process.env.AZURE_STORAGE_CONTAINER || 'uploads';
  private readonly client = process.env.AZURE_STORAGE_ACCOUNT_URL
    ? new BlobServiceClient(process.env.AZURE_STORAGE_ACCOUNT_URL, new DefaultAzureCredential())
    : undefined;

  isConfigured() {
    return Boolean(this.client);
  }

  private blobName(fileUrl: string) {
    return fileUrl.replace(/^uploads\//, '');
  }

  async upload(projectId: string, category: 'documents' | 'photos', filename: string, file: { buffer: Buffer; mimetype: string }): Promise<StoredFile> {
    const fileUrl = `uploads/projects/${projectId}/${category === 'photos' ? 'photos/' : ''}${filename}`;
    if (!this.client) return { fileUrl, contentType: file.mimetype };

    const blob = this.client.getContainerClient(this.containerName).getBlockBlobClient(this.blobName(fileUrl));
    await blob.uploadData(file.buffer, { blobHTTPHeaders: { blobContentType: file.mimetype } });
    return { fileUrl, contentType: file.mimetype };
  }

  async download(fileUrl: string) {
    if (this.client && fileUrl.startsWith('uploads/')) {
      const blob = this.client.getContainerClient(this.containerName).getBlobClient(this.blobName(fileUrl));
      const exists = await blob.exists();
      if (!exists) throw new NotFoundException('Uploaded file not found');
      const result = await blob.download();
      return { stream: result.readableStreamBody, contentType: result.contentType || 'application/octet-stream' };
    }

    const filePath = join(process.cwd(), fileUrl);
    return { stream: createReadStream(filePath), contentType: 'application/octet-stream' };
  }

  async delete(fileUrl: string) {
    if (this.client && fileUrl.startsWith('uploads/')) {
      await this.client.getContainerClient(this.containerName).deleteBlob(this.blobName(fileUrl));
      return;
    }

    const { unlink } = await import('node:fs/promises');
    await unlink(join(process.cwd(), fileUrl)).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}
