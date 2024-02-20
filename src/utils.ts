export const isStreaming = (url: string) => {
  const ext = url.split('.').pop();
  return ext === 'm3u8' || ext === 'm3u';
}

export const getPath = (url: string) => {
  return url.split('/').slice(0, -1).join('/');
}
