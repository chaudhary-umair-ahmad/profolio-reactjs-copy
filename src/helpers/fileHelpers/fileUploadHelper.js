import Resizer from 'react-image-file-resizer';
import tenantApi from '@api';

export default class FileUploadHelper {
  constructor(getS3PreSignedUrl) {
    this.getS3PreSignedUrl = getS3PreSignedUrl;
  }

  async getUUIDForLocalFile(attachmentType, associationKey, fileName) {
    let count = 0;
    let data;
    let latestError;
    return new Promise(async (resolve, reject) => {
      while (count < 3) {
        try {
          const res = await this.getS3PreSignedUrl({ attachmentType });
          if (res) {
            if (res.data) {
              data = { data: res?.data?.presigned_urls };
            }
          }
          break;
        } catch (e) {
          latestError = e;
          count += 1;
        }
      }
      if (data) {
        resolve(data);
      } else {
        reject(latestError);
      }
    });
  }

  async uploadFileOnS3(file, presignedData, isImageFile) {
    return new Promise(async function (resolve, reject) {
      try {
        if (presignedData) {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', presignedData.upload_url);

          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                resolve(xhr);
                return xhr.status;
              }
            }
          };
          xhr.onerror = (e) => {
            reject(e);
          };

          const type = isImageFile ? file.split(';')[0].split(':')[1] : file.type;

          xhr.setRequestHeader('Content-Type', type);

          if (isImageFile) {
            xhr.setRequestHeader('Content-Encoding', 'base64');
          }

          let buffer = file;

          if (isImageFile) {
            const byteString = atob(file.split(',')[1]);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < byteString.length; i++) {
              uint8Array[i] = byteString.charCodeAt(i);
            }
            buffer = new Blob([uint8Array], { type });
          }
          xhr.send(buffer);
        }
      } catch {}
    });
  }

  async resize(image) {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        image,
        800,
        800,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64',
      );
    });
  }
}
