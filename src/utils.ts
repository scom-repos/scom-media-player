import { moment } from "@ijstech/components";

export const isStreaming = (url: string) => {
  const ext = url.split('.').pop();
  return ext === 'm3u8' || ext === 'm3u';
}

export const getPath = (url: string) => {
  return url.split('/').slice(0, -1).join('/');
}

export const formatTime = (time: number|string) => {
  return moment(Number(time) * 1000).format('mm:ss');
}
