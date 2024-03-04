export const paramsSerializer = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  console.log('params serializer', params);

  // eslint-disable-next-line no-restricted-syntax
  for (const key in params) {
    if (Object.hasOwn(params, key)) {
      const value = params[key];

      if (Array.isArray(value)) {
        // Serialize arrays with the '[]' notation
        value.forEach((item) => {
          searchParams.append(key, item);
        });
      } else {
        // Serialize other values
        searchParams.append(key, value);
      }
    }
  }

  console.log('params serializer output', searchParams.toString());

  return searchParams.toString();
};
