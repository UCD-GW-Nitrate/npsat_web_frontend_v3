export const isObjectEmpty = (obj: Object) => Object.keys(obj).length === 0;

export const ordinalSuffix = (num: number) => {
  // const idx = (num == 11 || num == 12 || num == 13) ? -1 : num % 10 - 1;
  // const suffix = ['st', 'nd', 'rd'][idx] ?? 'th'
  // return `${num}${suffix}`;
  return `${num}${['st', 'nd', 'rd'][((((num + 90) % 100) - 10) % 10) - 1] || 'th'}`;
};
