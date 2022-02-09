import { formatDate, getCSSRootValue, formatDateShamsi } from './Utils';

const numberWithCommas = (number) => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export {
  formatDate,
  getCSSRootValue,
  formatDateShamsi,
  numberWithCommas
};
