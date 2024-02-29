import {
  ControlElement,
  customElements,
  Module,
  Styles,
  Container,
  Icon,
  Image,
  Label,
  Range,
  Panel,
  moment,
  Video,
  Control,
  GridLayout
} from '@ijstech/components';
import { ITrack } from '../inteface';
import { customRangeStyle, marqueeStyle, customVideoStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;

type callbackType = () => void;
type changedCallbackType = (value: boolean) => void;
type MediaType = 'video' | 'playlist';

interface ScomMediaPlayerPlayerElement extends ControlElement {
  url?: string;
  type?: MediaType;
  onNext?: callbackType;
  onPrev?: callbackType;
  onRandom?: callbackType;
  onStateChanged?: changedCallbackType;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-media-player--player']: ScomMediaPlayerPlayerElement;
    }
  }
}

interface IPlayer {
  url: string;
  type: MediaType;
}

const DEFAULT_SKIP_TIME = 10;

@customElements('i-scom-media-player--player')
export class ScomMediaPlayerPlayer extends Module {
  private player: any;
  private video: Video;
  private iconPlay: Icon;
  private iconRepeat: Icon;
  private iconShuffle: Icon;
  private imgTrack: Image;
  private lblTrack: Label;
  private lblArtist: Label;
  private trackRange: Range;
  private lblStart: Label;
  private lblEnd: Label;
  private pnlRange: Panel;
  private playerGrid: GridLayout;

  private _data: IPlayer = {
    url: '',
    type: 'playlist'
  };
  private isRepeat: boolean = false;
  private isShuffle: boolean = false;
  private currentTrack: ITrack|null = null;

  onNext: callbackType;
  onPrev: callbackType;
  onRandom: callbackType;
  onStateChanged: changedCallbackType;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.timeUpdateHandler = this.timeUpdateHandler.bind(this);
    this.updateDuration = this.updateDuration.bind(this);
    this.endedHandler = this.endedHandler.bind(this);
    this.playHandler = this.playHandler.bind(this);
    this.pauseHandler = this.pauseHandler.bind(this);
    this.playingHandler = this.playingHandler.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }

  static async create(options?: ScomMediaPlayerPlayerElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get url() {
    return this._data.url ?? '';
  }
  set url(value: string) {
    this._data.url = value ?? '';
  }

  get type() {
    return this._data.type ?? 'playlist';
  }
  set type(value: MediaType) {
    this._data.type = value ?? 'playlist';
  }

  get track() {
    return this.currentTrack;
  }

  setData(data: IPlayer) {
    this._data = {...data};
    this.renderUI();
  }

  private renderUI() {
    if (this.type === 'video') {
      this.video.visible = true;
      this.playerGrid.visible = false;
      this.video.url = this.url;
    } else {
      this.video.visible = false;
      this.playerGrid.visible = true;
    }
  }

  clear() {
    if (this.player) {
      this.player.currentTime(0);
      this.player.pause();
    }
  }

  pause() {
    if (this.player && !this.player.paused()) {
      this.player.pause();
    }
  }

  playTrack(track: ITrack) {
    if (!track) return;
    const currentSrc = this.player?.currentSrc();
    if (currentSrc && currentSrc === track.uri) {
      this.togglePlay();
    } else {
      this.player.pause();
      this.currentTrack = {...track};
      const type = this.getTrackType(track.uri);
      const src = this.getTrackSrc(track.uri);
      this.player.src({src, type});
      this.renderTrack();
      this.player.ready(function() {
        this.play().then(() => {
          this.pause();
          this.play();
        })
      });
    }
  }

  private togglePlay() {
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  private getTrackType(url: string) {
    return url.endsWith('.mp3') ? 'audio/mp3' : 'application/x-mpegURL';
  }

  private getTrackSrc(url: string) {
    return url.startsWith('//') || url.startsWith('http') ? url : this.url + '/' + url;
  }

  private renderTrack() {
    const { title = 'No title', artist = 'No name', poster = ''} = this.currentTrack || {};
    this.imgTrack.url = poster;
    this.lblArtist.caption = artist;
    this.lblTrack.caption = title;
    const parentWidth = this.lblTrack?.parentElement?.offsetWidth || 0;
    if (parentWidth && parentWidth < this.lblTrack.offsetWidth) {
      this.lblTrack.classList.add('marquee');
    } else {
      this.lblTrack.classList.remove('marquee');
    }
  }

  private updateDuration() {
    if (this.type === 'video') return;
    const durationValue = this.player?.duration() || this.currentTrack?.duration || 0;
    const duration = durationValue * 1000;
    this.lblEnd.caption = '00:00';
    if (duration <= 0 || !Number.isFinite(duration)) return;
    this.pnlRange.clearInnerHTML();
    this.trackRange = <i-range
      min={0}
      max={duration}
      value={0}
      step={1}
      width={'100%'}
      onChanged={() => {
        this.player.currentTime(this.trackRange.value / 1000);
        this.lblStart.caption = moment(this.trackRange.value).format('mm:ss');
      }}
      class={customRangeStyle}
    ></i-range>
    this.pnlRange.appendChild(this.trackRange);
    this.lblEnd.caption = moment(duration).format('mm:ss');
  }

  private playNextTrack() {
    if (this.onNext) this.onNext();
  }

  private playPrevTrack() {
    if (this.onPrev) this.onPrev();
  }

  private playRandomTrack() {
    if (this.onRandom) this.onRandom();
  }

  private onPlay(target: Control, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.playTrack(this.currentTrack);
  }

  private onRepeat() {
    this.isRepeat = !this.isRepeat;
    this.iconRepeat.fill = this.isRepeat ? Theme.colors.success.main : Theme.text.primary;
  }

  private onShuffle() {
    this.isShuffle = !this.isShuffle;
    this.iconShuffle.fill = this.isShuffle ? Theme.colors.success.main : Theme.text.primary;
  }

  resizeLayout(mobile: boolean) {}

 async init() {
    super.init();
    this.onNext = this.getAttribute('onNext', true) || this.onNext;
    this.onPrev = this.getAttribute('onPrev', true) || this.onPrev;
    this.onRandom = this.getAttribute('onRandom', true) || this.onRandom;
    this.onStateChanged = this.getAttribute('onStateChanged', true) || this.onStateChanged;
    const url = this.getAttribute('url', true);
    const type = this.getAttribute('type', true);
    this.setData({ url, type });
    this.player = await this.video.getPlayer();
    if (this.player) this.initEvents();
  }

  private initEvents() {
    const self = this;
    this.player.ready(function() {
      this.on('timeupdate', self.timeUpdateHandler);
      this.on('loadeddata',self.updateDuration);
      this.on('ended', self.endedHandler);
      this.on('play', self.playHandler);
      this.on('playing', self.playingHandler)
      this.on('pause', self.pauseHandler);
    })
  }

  private playHandler() {
    const players = document.getElementsByTagName('i-scom-media-player--player');
    const currentVideo = this.player.el().querySelector('video');
    for (let i = 0; i < players.length; i++) {
      const video = players[i].querySelector('video');
      if (video.id !== currentVideo.id) {
        (players[i] as ScomMediaPlayerPlayer).pause();
      }
    }
    if (currentVideo.readyState) {
      this.addMediaSessionEvents();
      this.updateMetadata();
    }
  }

  private playingHandler() {
    navigator.mediaSession.playbackState = 'playing';
    this.updateSessionData();
    if (this.type === 'playlist') {
      this.iconPlay.name = 'pause-circle';
      if (this.onStateChanged) this.onStateChanged(true);
    }
  }

  private pauseHandler() {
    navigator.mediaSession.playbackState = 'paused';
    this.updateSessionData();
    if (this.type === 'playlist') {
      this.iconPlay.name = 'play-circle';
      if (this.onStateChanged) this.onStateChanged(false);
    }
  }

  private endedHandler() {
    this.player.currentTime(0);
    navigator.mediaSession.playbackState = 'none';
    if (this.type === 'video') return;
    if (this.isRepeat) {
      this.player.play();
    } else if (this.isShuffle) {
      this.playRandomTrack();
    } else {
      this.playNextTrack();
    }
  }

  private timeUpdateHandler() {
    this.updateSessionData();
    if (this.type === 'video') return;
    const currentTime = this.player.currentTime() * 1000;
    if (this.trackRange) this.trackRange.value = currentTime;
    if (this.lblStart) this.lblStart.caption = moment(currentTime).format('mm:ss');
  }

  private addMediaSessionEvents() {
    const self = this;
    if ("mediaSession" in navigator) {
      const mediaSession = navigator.mediaSession;
      mediaSession.setActionHandler("play", async () => {
        await self.player.play();
      });

      mediaSession.setActionHandler("pause", () => {
        self.player.pause();
      });

      if (this.type === 'playlist') {
        mediaSession.setActionHandler('previoustrack', function() {
          self.playPrevTrack();
        });
        mediaSession.setActionHandler('nexttrack', function() {
          self.playNextTrack();
        });
      } else {
        mediaSession.setActionHandler('previoustrack', null);
        mediaSession.setActionHandler('nexttrack', null);
      }

      mediaSession.setActionHandler("seekto", (details) => {
        if (isNaN(self.player.duration())) {
          return;
        }
        self.player.currentTime(details.seekTime);
      });

      // mediaSession.setActionHandler('seekbackward', function(event) {
      //   const skipTime = event.seekOffset || DEFAULT_SKIP_TIME;
      //   player.currentTime(Math.max(player.currentTime() - skipTime, 0));
      //   self.updatePositionState();
      // });

      // mediaSession.setActionHandler('seekforward', function(event) {
      //   const skipTime = event.seekOffset || DEFAULT_SKIP_TIME;
      //   player.currentTime(Math.min(player.currentTime() + skipTime, player.duration()));
      //   self.updatePositionState();
      // });
    }
  }

  private updateSessionData() {
    if (isNaN(this.player.duration())) return;
    const seekableLength = this.player.seekable().length;
    if (seekableLength === 0) return;
    navigator.mediaSession.setPositionState({
      duration: Math.max(
        this.player.seekable().end(seekableLength - 1),
        this.player.currentTime()
      ),
      playbackRate: this.player.playbackRate(),
      position: this.player.currentTime()
    });
    navigator.mediaSession.playbackState = this.player.paused() ? 'paused' : 'playing';
  }

  private updateMetadata() {
    const { title = 'No title', artist = 'No name', poster = '' } = this.currentTrack || {};
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: '',
      artwork: poster ? [{src: poster}] : []
    });
  }

  render() {
    return (
      <i-vstack
        id="playerWrapper"
        width="100%" height={'100%'}
        background={{color: Theme.background.paper}}
      >
        <i-video
          id="video"
          isStreaming={true}
          margin={{left: 'auto', right: 'auto'}}
          display='block'
          width={'100%'} height={'100%'}
          stack={{grow: '1', shrink: '1'}}
          class={customVideoStyle}
          visible={false}
        ></i-video>
        <i-grid-layout
          id="playerGrid"
          gap={{row: '1rem', column: '0px'}}
          width="100%" height={'100%'}
          padding={{top: '1rem', bottom: '1rem', left: '1rem', right: '1rem'}}
          templateRows={['auto']}
          templateColumns={['1fr']}
          verticalAlignment='center'
        >
          <i-image
            id="imgTrack"
            width={'13rem'} height={'auto'}
            minHeight={'6.25rem'}
            margin={{left: 'auto', right: 'auto'}}
            display='block'
            background={{color: Theme.background.default}}
          ></i-image>
          <i-hstack
            id="pnlInfo"
            horizontalAlignment='space-between'
            verticalAlignment='center'
            margin={{top: '1rem', bottom: '1rem'}}
            width={'100%'}
            overflow={'hidden'}
            mediaQueries={[
              {
                maxWidth: '767px',
                properties: {
                  margin: {top: 0, bottom: 0}
                }
              }
            ]}
          >
            <i-vstack gap="0.25rem" verticalAlignment='center' maxWidth={'100%'}>
              <i-panel maxWidth={'100%'} overflow={'hidden'}>
                <i-label
                  id="lblTrack"
                  caption=''
                  font={{weight: 600, size: 'clamp(1rem, 0.95rem + 0.25vw, 1.25rem)'}}
                  lineHeight={'1.375rem'}
                  class={marqueeStyle}
                ></i-label>
              </i-panel>
              <i-label
                id="lblArtist"
                caption=''
                maxWidth={'100%'}
                textOverflow='ellipsis'
                font={{size: 'clamp(0.75rem, 0.7rem + 0.25vw, 1rem)'}}
              ></i-label>
            </i-vstack>
          </i-hstack>
          <i-vstack
            id="pnlTimeline"
            width={'100%'}
          >
            <i-panel id="pnlRange" stack={{'grow': '1', 'shrink': '1'}}></i-panel>
            <i-hstack
              horizontalAlignment='space-between'
              gap="0.25rem"
            >
              <i-label id="lblStart" caption='0:00' font={{size: '0.875rem'}}></i-label>
              <i-label id='lblEnd' caption='0:00' font={{size: '0.875rem'}}></i-label>
            </i-hstack>
          </i-vstack>
          <i-hstack
            id="pnlControls"
            verticalAlignment='center'
            horizontalAlignment='space-between'
            gap={'1.25rem'}
            width={'100%'}
            mediaQueries={[
              {
                maxWidth: '767px',
                properties: {
                  gap: '0.5rem'
                }
              }
            ]}
          >
            <i-panel
              id="pnlRandom"
              cursor='pointer'
              hover={{opacity: 0.5}}
              onClick={() => this.onShuffle()}
            >
              <i-icon
                id="iconShuffle"
                name="random"
                width={'1rem'}
                height={'1rem'}
                fill={Theme.text.primary}
              ></i-icon>
            </i-panel>
            <i-grid-layout
              verticalAlignment="stretch"
              columnsPerRow={3}
              height={'2.5rem'}
              border={{radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider}}
              stack={{grow: '1', shrink: '1'}}
            >
              <i-vstack
                verticalAlignment='center'
                horizontalAlignment='center'
                cursor='pointer'
                hover={{opacity: 0.5}}
                onClick={() => this.playPrevTrack()}
              >
                <i-icon
                  name="step-backward"
                  width={'1rem'} height={'1rem'}
                  fill={Theme.text.primary}
                ></i-icon>
              </i-vstack>
              <i-vstack
                verticalAlignment='center'
                horizontalAlignment='center'
                cursor='pointer'
                hover={{opacity: 0.5}}
                onClick={this.onPlay}
              >
                <i-icon
                  id="iconPlay"
                  name="play-circle"
                  width={'1.75rem'} height={'1.75rem'}
                  fill={Theme.text.primary}
                ></i-icon>
              </i-vstack>
              <i-vstack
                verticalAlignment='center'
                horizontalAlignment='center'
                cursor='pointer'
                hover={{opacity: 0.5}}
                onClick={() => this.playNextTrack()}
              >
                <i-icon
                  name="step-forward"
                  width={'1rem'} height={'1rem'}
                  fill={Theme.text.primary}
                ></i-icon>
              </i-vstack>
            </i-grid-layout>
            <i-panel
              id="pnlRepeat"
              cursor='pointer'
              hover={{opacity: 0.5}}
              onClick={() => this.onRepeat()}
            >
              <i-icon
                id="iconRepeat"
                name="redo"
                width={'0.875rem'} height={'0.875rem'}
                fill={Theme.text.primary}
              ></i-icon>
            </i-panel>
          </i-hstack>
        </i-grid-layout>
      </i-vstack>
    )
  }
}
