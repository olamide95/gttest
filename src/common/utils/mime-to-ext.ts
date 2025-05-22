export function mimeToExt(mimeType: string): string {
    switch (mimeType) {
        case 'image/jpeg':
            return 'jpg';

        case 'image/png':
            return 'png';

        case 'image/webp':
            return 'webp';

        case 'application/pdf':
            return 'pdf';

        case 'text/csv':
            return 'csv';

        case 'application/msword':
            return 'doc';

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'docx';

        case 'application/vnd.oasis.opendocument.text':
            return 'odt';

        case 'application/vnd.ms-powerpoint':
            return 'ppt';

        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'pptx';

        case 'text/plain':
            return 'txt';

        case 'application/vnd.ms-excel':
            return 'xls';

        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return 'xlsx';
    }
}
