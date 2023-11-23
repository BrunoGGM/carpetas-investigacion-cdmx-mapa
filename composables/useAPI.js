export const useAPI = (request, opts) => {
  const config = useRuntimeConfig();
  return $fetch(request, {
    baseURL: config.public.API_URL + '/api',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    ...opts,
  });
};
