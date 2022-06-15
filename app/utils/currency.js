export const currencyFormatter = value => {
  const formatter = new Intl.NumberFormat('id', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
};

export const formatCurrency = value => {
  if (small) {
    if (value > 1000000) {
      return `${Math.floor(value / 1000000)} jt`;
    }
  }
  const val = parseInt(value, 10);
  return `${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

export const currencyPunctuation = value => {
  if (!value?.length) return value;
  return value.replaceAll(/\./g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
