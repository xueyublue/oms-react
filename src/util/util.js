export const formatNumberWithCommas = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getCsvHeaders = (columns) => {
  let headers = [];
  for (let i = 0; i < columns.length; i++) {
    headers[i] = { label: columns[i].title, key: columns[i].key };
  }
  return headers;
};
