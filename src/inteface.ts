export interface ITrack {
  id?: string;
  title: string;
  artist?: string;
  poster?: string;
  duration?: string;
  uri: string;
  attributes?: any;
  timeline?: number;
}

export interface IMediaPlayer {
  url: string;
}