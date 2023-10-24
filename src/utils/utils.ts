export const utilordinalSuffix = (num: number) =>
  `${num}${['st', 'nd', 'rd'][((((num + 90) % 100) - 10) % 10) - 1] || 'th'}`;

export const isObjectEmpty = (obj: Object) => Object.keys(obj).length === 0;
