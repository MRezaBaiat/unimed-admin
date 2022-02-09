import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment-jalali';

export const exportToCSV = (csvData, fileName) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const ws = XLSX.utils.json_to_sheet(csvData);
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

export function formatDate (date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) { month = '0' + month; }
  if (day.length < 2) { day = '0' + day; }
  return [year, month, day].join('-');
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const safeAssignStyles = (style: object | object[], ...toAdd:(object | object[])[]) => {
  const newStyle = {};
  if (Array.isArray(style)) {
    style.forEach((st) => {
      Object.assign(newStyle, st);
    });
  } else {
    Object.assign(newStyle, style);
  }

  if (!toAdd) {
    return newStyle;
  }

  toAdd.forEach((star) => {
    if (Array.isArray(star)) {
      star.forEach((st) => {
        Object.assign(newStyle, st);
      });
    } else {
      Object.assign(newStyle, star);
    }
  });
  return newStyle;
};

export function numbersToPersian (enDigit) { // PERSIAN, ARABIC, URDO
  let newValue = '';
  for (let i = 0; i < enDigit.length; i++) {
    const ch = enDigit.charCodeAt(i);
    if (ch >= 48 && ch <= 57) {
      // european digit range
      const newChar = ch + 1584;
      newValue = newValue + String.fromCharCode(newChar);
    } else { newValue = newValue + String.fromCharCode(ch); }
  }
  return newValue;
}

export function numbersToEnglish (str: string) {
  if (!str) {
    return str;
  }
  str = String(str);
  // convert persian digits [۰۱۲۳۴۵۶۷۸۹]
  let e = '۰'.charCodeAt(0);
  // @ts-ignore
  str = str.replace(/[۰-۹]/g, (t) => {
    console.log('replacing', t);
    return t.charCodeAt(0) - e;
  });

  // convert arabic indic digits [٠١٢٣٤٥٦٧٨٩]
  e = '٠'.charCodeAt(0);
  // @ts-ignore
  str = str.replace(/[٠-٩]/g, t => t.charCodeAt(0) - e);
  return str;
}

export function convertToDate (date): moment {
  return moment(date);
}

export function formatDateShamsi (date): string {
  return numbersToPersian(moment(date).locale('fa').format('jYYYY/jMM/jDD - HH:mm'));

  /* const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) { month = '0' + month; }
  if (day.length < 2) { day = '0' + day; }
  return numbersToPersian(d.toLocaleDateString('Fa-Ir') + ' - ' + d.getHours() + ':' + d.getMinutes()); */
  // return [year, month, day].join('-') + '    ' + d.getHours() + ':' + d.getMinutes();
}

export function getCSSRootValue (valueName: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(valueName);
}

export function cssValueToPixel (value: string) {
  return document.documentElement.clientHeight * 0.65;
}
