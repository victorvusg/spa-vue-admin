import moment from 'moment';

export const formatDate = (value, showTime = false) => {
  if (value && moment(value).isValid()) {
    return showTime
      ? moment
          .utc(String(value))
          .local()
          .format('HH:mm - DD/MM/YYYY')
      : moment(String(value)).format('DD/MM/YYYY');
  }
  return value;
};

export const formatPhone = (value) => {
  const formated = value.replace(/(\d{1,3})(\d{1,3})(\d{1,4})/g, '$1 $2 $3');
  return formated;
};
export const formatCurrency = (value, shortTerm = false, unit = 'đ') => {
  if (shortTerm) {
    return `${value}k`;
  }
  return `${Number(value * 1000).toLocaleString()} ${unit}`;
};
export const formatCoin = (value) => `${value.toLocaleString('en')} Xu`;
export const formatPoint = (value) => `${(value * 1000).toLocaleString()} `;
