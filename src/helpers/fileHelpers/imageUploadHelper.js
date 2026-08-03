import FileUploadHelper from './fileUploadHelper';
import { generateUUID } from '../../utility/utility';
import { notification } from '../../components/common';
import appConstants from '@constants';

const removeDuplicates = (files) => {
  let removeDuplicate;
  const listOfKeys = [];

  for (var x = 0; x < files.length; ++x) {
    if (typeof files[x].id === 'string') {
      listOfKeys.push(files[x].baseUrl);
    } else {
      listOfKeys.push('');
    }
  }

  removeDuplicate = files.filter((e, index) => {
    if (typeof e.id === 'string') {
      return !listOfKeys.includes(e.baseUrl, index + 1);
    } else {
      return true;
    }
  });

  return removeDuplicate;
};

export const fileToBase64 = (file) => {
  return new Promise((resolve) => {
    let baseURL = '';
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      baseURL = reader.result;
      resolve(baseURL);
    };
  });
};

const getDimensions = (baseURL) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = baseURL;
    img.onload = () => {
      const dimensions = {
        width: img.width,
        height: img.height,
      };
      resolve(dimensions);
    };
  });
};

export async function addBlobIdentifier(files) {
  const newFiles = await Promise.all(
    Object.keys(files).map(async (key) => {
      const baseUrl = await fileToBase64(files[key]);
      const dimensions = await getDimensions(baseUrl);
      return {
        file: files[key],
        baseUrl,
        dimensions,
        analysing: false,
        analyseError: false,
      };
    }),
  );

  return newFiles;
}

export const onFilesAdded = (files, setFiles, newFiles, filesAllowed) => {
  let filesToAdd = [];
  if (filesAllowed && filesAllowed?.length > 0) {
    newFiles.forEach((fileToAdd) => {
      if (!!(fileToAdd?.dimensions?.height < 200 || fileToAdd?.dimensions?.width < 200)) {
        notification.error(`${fileToAdd?.file?.name} size should be greater than 200 * 200`);
      } else {
        filesAllowed.forEach((extension) => {
          fileToAdd?.file?.type.endsWith(extension) && filesToAdd.push(fileToAdd);
        });
      }
    });
  } else {
    filesToAdd = newFiles;
  }

  filesToAdd = filesToAdd.map((item) => {
    return {
      id: generateUUID(),
      ...item,
      uploaded: false,
      uploading: true,
      inError: false,
      analysing: false,
      analyseError: false,
    };
  });

  const filesData = [...files, ...filesToAdd];
  const afterDup = removeDuplicates(filesData);
  setFiles(afterDup);
};

export const updateImage = (files, setFiles, file, updated) => {
  const filesData = [...files];
  for (let item of filesData) {
    if (file.id == item.id) {
      item = Object.assign(item, updated);
    }
  }
  setFiles([...filesData]);
};

export const uploadFile = async (
  item,
  getS3PreSignedUrl,
  attachmentType,
  associationKey,
  files,
  setFiles,
  makeBlob = false,
  isSvg = false,
  updateDocument,
  onImageUpload,
  imageAnalyser
) => {
  const { file, uploaded } = item;
  if (uploaded === true) return;
  const fileUploader = new FileUploadHelper(getS3PreSignedUrl);
  const isImageFile = isSvg ? false : !!file?.type && file.type.includes('image');

  let fileData = file;
  if (isImageFile && !isSvg) {
    fileData = await fileUploader.resize(file);
  }
  let presignedUrlResponse;
  try {
    updateImage(files, setFiles, item, {
      id: item.id,
      uploaded: false,
      uploading: true,
      inError: false,
      analysing: false,
      analyseError: false,
      localPreview: fileData,
    });
    presignedUrlResponse = await fileUploader.getUUIDForLocalFile(attachmentType, associationKey, file.name);
  } catch (e) {
    const data = { id: item.id, uploaded: false, uploading: false, inError: true, analysing: false, analyseError: false, };
    updateImage(files, setFiles, item, data);
  }
  const presignedData = presignedUrlResponse?.data?.[0];
  try {
    const res = await fileUploader.uploadFileOnS3(fileData, presignedData, isImageFile);
    if (res) {
      onImageUpload(res);
      if (updateDocument) updateDocument(item, presignedData.id);
      else if (makeBlob) {
        const b64 = await fetch(fileData);
        const b64Blob = await b64.blob();
        const data = {
          // id: presignedData.uuid,
          uuid: presignedData.uuid,
          uploaded: true,
          uploading: false,
          analysing: false,
          analyseError: false,
          localPreviewLarge: `${presignedData?.base_url}/${presignedData.uuid}/large.jpg`,
          localPreview: URL.createObjectURL(b64Blob),
        };
        updateImage(files, setFiles, item, data);
      } else if (isSvg) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          const data = {
            // id: presignedData.uuid,
            uuid: presignedData.uuid,
            localPreviewLarge: presignedData?.base_url
              ? `${presignedData?.base_url}/${presignedData.uuid}/large.jpg}`
              : undefined,
            uploaded: true,
            uploading: false,
            analysing: false,
            analyseError: false,
            localPreview: ev.target.result,
          };
          updateImage(files, setFiles, item, data);
        };
        reader.readAsDataURL(fileData);
      } else {
        const data = {
          uuid: presignedData.uuid,
          localPreviewLarge: presignedData?.base_url
            ? `${presignedData?.base_url}/${presignedData.uuid}/large.jpg}`
            : undefined,
          uploaded: true,
          uploading: false,
          analyseError: false,
          analysing: false,
        };
        updateImage(files, setFiles, item, data);
      }
    }
    if (item.uploaded === true && appConstants.IMAGE_ANALYSER && attachmentType === 'user_profile') {
      updateImage(files, setFiles, item, { analysing: true, analyseError: false });
      setTimeout(() => {
        imageAnalyser(item.uuid)
          .then((response) => {
            updateImage(files, setFiles, item, { analysing: false, inError: false });
            const messages = response?.data?.messages;
            if (Array.isArray(messages) && messages.length > 0) {
              updateImage(files, setFiles, item, { analysing: false, inError: true, analyseError: messages });
            }
          })
          .catch((error) => {
            console.error('Image analysis error:', error);
            updateImage(files, setFiles, item, { analysing: false, inError: true });
          });
      }, 1000); 
    }
    
  } catch (e) {
    const data = {
      uploaded: false,
      uploading: false,
      inError: true,
      analysing: false,
      analyseError: false,
    };
    updateImage(files, setFiles, item, data);
  }
};
