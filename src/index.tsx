import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  Styles,
  Panel,
  GridLayout
} from '@ijstech/components'
import { ScomMediaPlayerPlayer, ScomMediaPlayerPlaylist } from './common/index'
import { IMediaPlayer, ITrack } from './inteface'
import { customScrollStyle } from './index.css'
import { isAudio, isStreaming } from './utils';
import { Model } from './model';

const Theme = Styles.Theme.ThemeVars;

interface ScomMediaPlayerElement extends ControlElement {
  url?: string;
}

const MAX_WIDTH = 700;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-media-player"]: ScomMediaPlayerElement;
    }
  }
}

@customModule
@customElements('i-scom-media-player')
export default class ScomMediaPlayer extends Module {
  private model: Model;
  private playList: ScomMediaPlayerPlaylist;
  private player: ScomMediaPlayerPlayer;
  private playlistEl: GridLayout;
  private playerPanel: Panel;

  tag: any = {
    light: {},
    dark: {}
  }
  private isVideo: boolean = false;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.initModel();
    this.onPlay = this.onPlay.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onRandom = this.onRandom.bind(this);
  }

  static async create(options?: ScomMediaPlayerElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get url() {
    return this.model.url;
  }
  set url(value: string) {
    this.model.url = value;
  }

  private get parsedData() {
    return this.model.parsedData;
  }

  getConfigurators() {
    this.initModel();
    return this.model.getConfigurators();
  }

  getTag() {
    return this.tag;
  }

  setTag(value: any) {
    this.model.setTag(value);
  }

  private async setData(value: IMediaPlayer) {
    this.model.setData(value);
  }

  getData() {
    return this.model.getData();
  }

  private async renderUI() {
    if (!this.url || (!isStreaming(this.url) && !isAudio(this.url))) return;
    if (isAudio(this.url)) {
      await this.renderAudio();
    } else {
      await this.renderStreamData();
    }
  }

  private async renderStreamData() {
    await this.model.handleStreamData();
    this.player.url = this.url;
    this.checkParsedData();
  }

  private async renderAudio() {
    this.isVideo = true;
    this.playList.visible = false;
    this.playerPanel.visible = true;
    this.playerPanel.padding = { top: '0', bottom: '0', left: '0', right: '0' };
    this.playlistEl.templateColumns = ['auto'];
    this.playlistEl.templateAreas = [['player'], ['player']];
    this.player.border = { radius: '2rem' };
    this.playlistEl.margin = { bottom: '1rem' };
    this.player.setData({
      type: 'audio',
      url: this.url
    })
  }

  private checkParsedData() {
    if (!this.parsedData) return;
    this.playerPanel.padding = { top: '1rem', bottom: '1rem', left: '2.5rem', right: '2.5rem' };
    this.player.border = { radius: '0px' };
    this.playlistEl.margin = { bottom: 0 };
    const playlists = this.parsedData.playlists || [];
    const segments = this.parsedData.segments || [];
    const isStreamVideo = segments.every(segment => /\.ts$/.test(segment.uri || ''));
    const isVideo = playlists.some(playlist => playlist.attributes?.RESOLUTION);
    if ((playlists.length && !isVideo) || (segments.length && !isStreamVideo)) {
      let value = [...playlists];
      const haveAudioGroup = !this.model.isEmptyObject(this.parsedData?.mediaGroups?.AUDIO);
      const isAudioOnly = playlists.length && playlists.every(playlist => !playlist.attributes?.RESOLUTION);
      if (isAudioOnly && haveAudioGroup) {
        value = [{ uri: this.url, title: '' }];
      } else if (!isStreamVideo) {
        value = [...segments].map(segment => ({ ...segment, poster: segment?.custom?.poster || '' }));
      }
      this.renderPlaylist(value);
    } else {
      this.renderVideo();
    }
  }

  private renderVideo() {
    this.isVideo = true;
    this.playList.visible = false;
    this.playerPanel.visible = true;
    this.playlistEl.templateColumns = ['auto'];
    this.playlistEl.templateAreas = [['player'], ['player']];
    this.player.setData({
      type: 'video',
      url: this.url
    })
  }

  private renderPlaylist(tracks: any[]) {
    this.isVideo = false;
    this.playList.visible = true;
    this.playerPanel.visible = false;
    this.player.setData({
      type: 'playlist',
      url: this.url
    })
    this.playList.setData({
      tracks,
      title: this.parsedData?.title || '',
      description: '',
      picture: ''
    });
  }

  onHide(): void {
    this.player.clear();
    // navigator.mediaSession.playbackState = 'none';
  }

  private onPlay(data: ITrack) {
    if (!data) return;
    this.player.playTrack(data);
    if (!this.playerPanel.visible) {
      this.playerPanel.visible = true;
    }
  }

  private onNext() {
    const tracks = this.playList.tracks;
    const index = tracks.findIndex((track: ITrack) => track.uri === this.player.track.uri);
    const newIndex = (((index + 1) % tracks.length) + tracks.length) % tracks.length;
    this.playList.activeTrack = newIndex;
    this.onPlay(tracks[newIndex])
  }

  private onPrev() {
    const tracks = this.playList.tracks;
    const index = tracks.findIndex((track: ITrack) => track.uri === this.player.track.uri);
    const newIndex = (((index + -1) % tracks.length) + tracks.length) % tracks.length;
    this.playList.activeTrack = newIndex;
    this.onPlay(tracks[newIndex])
  }

  private onRandom() {
    const tracks = this.playList.tracks;
    const newIndex = Math.floor(Math.random() * tracks.length);
    this.playList.activeTrack = newIndex;
    this.onPlay(tracks[newIndex])
  }

  private onStateChanged(value: boolean) {
    this.playList.togglePlay(value);
  }

  private resizeLayout() {
    if (this.isVideo) return;
    if (this.offsetWidth <= 0) return;
    const tagWidth = Number(this.tag?.width);
    const hasSmallWidth = (this.offsetWidth !== 0 && this.offsetWidth < MAX_WIDTH) || (window as any).innerWidth < MAX_WIDTH || (!isNaN(tagWidth) && tagWidth !== 0 && tagWidth < MAX_WIDTH);
    if (hasSmallWidth) {
      this.playlistEl.templateColumns = ['auto'];
      this.playlistEl.templateAreas = [['player'], ['playlist']];

      this.playerPanel.padding = { top: 0, bottom: 0, left: 0, right: 0 };
      this.player.resizeLayout(true);
    } else {
      this.playlistEl.templateColumns = ['repeat(2, 1fr)'];
      this.playlistEl.templateAreas = [['playlist', 'player']];

      this.playerPanel.padding = { top: '1rem', bottom: '1rem', left: '2.5rem', right: '2.5rem' };
      this.player.resizeLayout(false);
    }
  }

  refresh(skipRefreshControls?: boolean): void {
    super.refresh(skipRefreshControls);
    this.resizeLayout();
  }

  private initModel() {
    if (!this.model) {
      this.model = new Model(this, {
        updateWidget: this.renderUI.bind(this),
        resize: this.resizeLayout.bind(this)
      })
    }
  }

  init() {
    super.init();
    const url = this.getAttribute('url', true);
    if (url) this.setData({ url });
  }

  render() {
    return (
      <i-hstack
        maxHeight={'100dvh'}
        height="100%"
        overflow={'hidden'}
        background={{ color: Theme.background.main }}
      >
        <i-grid-layout
          id="playlistEl"
          position='relative'
          maxHeight={'100%'}
          stack={{ grow: '1', shrink: '1' }}
          templateColumns={['repeat(2, 1fr)']}
          gap={{ column: '0px', row: '0.75rem' }}
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {
                templateColumns: ['auto'],
                templateAreas: [['player'], ['playlist']]
              }
            }
          ]}
        >
          <i-scom-media-player--playlist
            id="playList"
            display='block'
            padding={{ left: '1rem', right: '1rem' }}
            width={'100%'} height={'100%'}
            overflow={{ y: 'auto' }}
            grid={{ area: 'playlist' }}
            class={customScrollStyle}
            onItemClicked={this.onPlay}
          />
          <i-panel
            id="playerPanel"
            padding={{ top: '1rem', bottom: '1rem', left: '2.5rem', right: '2.5rem' }}
            width={'100%'} height={'100%'}
            grid={{ area: 'player' }}
            visible={false}
            mediaQueries={[
              {
                maxWidth: '767px',
                properties: {
                  padding: { top: 0, bottom: 0, left: 0, right: 0 }
                }
              },
              {
                minWidth: '768px',
                maxWidth: '900px',
                properties: {
                  padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }
                }
              }
            ]}
          >
            <i-scom-media-player--player
              id="player"
              display='block'
              width={'100%'} height={'100%'}
              background={{ color: Theme.background.paper }}
              onNext={this.onNext}
              onPrev={this.onPrev}
              onRandom={this.onRandom}
              onStateChanged={this.onStateChanged}
            />
          </i-panel>
        </i-grid-layout>
      </i-hstack>
    )
  }
}
