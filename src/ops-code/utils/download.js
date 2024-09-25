import { message } from '@/utils/helpers';

export function resetForm(tableColumns) {
  const data = {};
  tableColumns.forEach((col) => {
    if (col.type === 'Number') {
      data[col.fieldName] = '';
    } else if (col.type === 'Enum') {
      if (col.defaultValue) {
        data[col.fieldName] = col.defaultValue;
      } else {
        data[col.fieldName] = '';
      }
    } else if (col.type === 'Array') {
      data[col.fieldName] = [];
    } else if (col.type === 'Bool') {
      data[col.fieldName] = true;
    } else {
      data[col.fieldName] = '';
    }
  });
  return data;
}

export function imatateDownloadByA(href, filename) {
  const a = document.createElement('a');
  a.download = filename;
  a.style.display = 'none';
  a.href = href;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(href);
}

export function downloadFile(content, filename) {
  if (content.type === 'application/json') {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const jsonData = JSON.parse(fileReader.result);
      message(jsonData.message, { type: 'error' });
    };
    fileReader.readAsText(content);
  } else {
    const blob = new Blob([content], { type: 'application/zip' });
    // IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      imatateDownloadByA(window.URL.createObjectURL(blob), filename);
    }
  }
}

export function uploadFileValidation(file, maxSize, typeList) {
  if (!file.name) {
    return false;
  }
  const fileSuffix = file.name.replace(/.+\./, '');
  if (typeList.length > 0 && typeList.indexOf(fileSuffix.toLowerCase()) === -1) {
    message('This is not a valid job operation configure file', { type: 'error' });
    return false;
  }

  if (maxSize > 1000000 && file.size > maxSize) {
    message(`Import Failed: File size must be less than ${Math.trunc(maxSize / 1000000)} MB`, { type: 'error' });
    return false;
  } else if (maxSize < 1000000 && file.size > maxSize) {
    message(`Import Failed: File size must be less than ${Math.trunc(maxSize / 1000)} KB`, { type: 'error' });
    return false;
  }
  // Only one file with a size less than {{ Math.trunc(maxSize/1000000) }}MB is allowed.
  return true;
}
