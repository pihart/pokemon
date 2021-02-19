export const prefixedLog = (...prefix: any[]) => (...data: any[]) =>
  console.log(...prefix, ...data);
