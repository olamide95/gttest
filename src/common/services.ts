import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from './config';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudinaryService {
    async uploadMedia(
        file: string,
        folder: string,
        key: string,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        cloudinary.config(cloudinaryConfig);
        try {
            // Generate a unique filename using UUID
            const uniqueFilename = uuidv4();
            const filename = `${uniqueFilename}.jpg`;

            // Decode the base64 string
            const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            // Save the file locally
            await fs.promises.writeFile(filename, buffer);

            const upload = await cloudinary.uploader.upload(filename, {
                use_filename: false,
                unique_filename: true,
                public_id: key,
                overwrite: false,
                folder,
                access_mode: 'authenticated',
                resource_type: 'auto',
            });

            // Delete the local file after uploading to Cloudinary
            await fs.promises.unlink(filename);
            return upload;
        } catch (error) {
            console.error(error);
            throw new BadRequestException({
                name: 'upload',
                message: 'could not upload resource',
            });
        }
    }

    async deleteMedia(filename, resource_type): Promise<{ result: string }> {
        cloudinary.config(cloudinaryConfig);
        return await cloudinary.uploader.destroy(
            filename,
            { resource_type },
            (error, response) => {
                if (response.result === 'ok') return true;
                else if (error) return false;
                return false;
            },
        );
    }
}
