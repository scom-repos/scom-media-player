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
  Video
} from '@ijstech/components';
import { ITrack } from '../inteface';
import { customRangeStyle, marqueeStyle } from './index.css';
const Theme = Styles.Theme.ThemeVars;

type callbackType = () => void;
type changedCallbackType = (value: boolean) => void;

interface ScomMediaPlayerPlayerElement extends ControlElement {
  track?: ITrack;
  url?: string;
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
  track?: ITrack;
  url?: string;
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

  private _data: IPlayer;
  private isRepeat: boolean = false;
  private isShuffle: boolean = false;

  onNext: callbackType;
  onPrev: callbackType;
  onRandom: callbackType;
  onStateChanged: changedCallbackType;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.timeUpdateHandler = this.timeUpdateHandler.bind(this);
    this.updateDuration = this.updateDuration.bind(this);
    this.endedHandler = this.endedHandler.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }

  static async create(options?: ScomMediaPlayerPlayerElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get track() {
    return this._data.track;
  }
  set track(value: ITrack) {
    this._data.track = value;
  }

  get url() {
    return this._data.url ?? '';
  }
  set url(value: string) {
    this._data.url = value ?? '';
  }

  setData(data: IPlayer) {
    this._data = {...data};
  }

  private endedHandler() {
    this.player.currentTime(0);
    navigator.mediaSession.playbackState = 'none';
    if (this.isRepeat) {
      this.player.play();
    } else if (this.isShuffle) {
      this.playRandomTrack();
    } else {
      this.playNextTrack();
    }
  }

  private timeUpdateHandler() {
    const currentTime = this.player.currentTime() * 1000;
    if (this.trackRange) this.trackRange.value = currentTime;
    if (this.lblStart) this.lblStart.caption = moment(currentTime).format('mm:ss');
    this.updatePositionState();
  }

  playTrack(track: ITrack) {
    if (!track) return;
    const currentSrc = this.player.currentSrc();
    if (currentSrc && currentSrc === track.uri) {
      this.togglePlay();
    } else {
      this.track = {...track};
      const type = this.getTrackType(track.uri);
      const src = this.getTrackSrc(track.uri);
      this.player.src({src, type});
      this.renderTrack();
      const self = this;
      this.player.ready(function() {
        self.player.play().then(() => {
          self.player.pause();
          self.player.play();
        })
      });
    }
  }

  private updateMetadata() {
    const { title = 'No title', artist = 'No name', poster = '', uri } = this.track || {};
    if (!uri) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: '',
      artwork: poster ? [{src: poster}] : []
    });
  }

  private updatePositionState() {
    if ('setPositionState' in navigator.mediaSession) {
      const duration = this.player.duration() || 0;
      const position = this.player.currentTime();
      const playbackRate = this.player.playbackRate();
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate,
        position
      });
    }
  }

  private getTrackType(url: string) {
    return url.endsWith('.mp3') ? 'audio/mp3' : 'application/x-mpegURL';
  }

  private getTrackSrc(url: string) {
    return url.startsWith('//') || url.startsWith('http') ? url : this.url + '/' + url;
  }

  private renderTrack() {
    this.imgTrack.url = this.track?.poster || '';
    this.lblArtist.caption = this.track?.artist || 'No name';
    this.lblTrack.caption = this.track?.title || 'No title';
    const parentWidth = this.lblTrack?.parentElement?.offsetWidth || 0;
    if (parentWidth && parentWidth < this.lblTrack.offsetWidth) {
      this.lblTrack.classList.add('marquee');
    } else {
      this.lblTrack.classList.remove('marquee');
    }
  }

  private updateDuration() {
    const durationValue = this.player?.duration() || this.track?.duration || 0;
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

  private togglePlay() {
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
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

  private onPlay() {
    this.playTrack(this.track);
  }

  private onRepeat() {
    this.isRepeat = !this.isRepeat;
    this.iconRepeat.fill = this.isRepeat ? Theme.colors.success.main : Theme.text.primary;
  }

  private onShuffle() {
    this.isShuffle = !this.isShuffle;
    this.iconShuffle.fill = this.isShuffle ? Theme.colors.success.main : Theme.text.primary;
  }

  resizeLayout(mobile: boolean) {
  }

 async init() {
    super.init();
    this.onNext = this.getAttribute('onNext', true) || this.onNext;
    this.onPrev = this.getAttribute('onPrev', true) || this.onPrev;
    this.onRandom = this.getAttribute('onRandom', true) || this.onRandom;
    this.onStateChanged = this.getAttribute('onStateChanged', true) || this.onStateChanged;
    const track = this.getAttribute('track', true);
    const url = this.getAttribute('url', true);
    this.setData({ track, url });
    this.player = await this.video.getPlayer();
    const self = this;
    if (this.player) {
      this.player.ready(function() {
        self.player.on('timeupdate', self.timeUpdateHandler);
        self.player.on('loadeddata', () => {
          self.updateDuration();
          self.updateMetadata();
          self.updatePositionState();
        })
        self.player.on('canplaythrough', () => {
          self.initMediaSession();
        });
        self.player.on('ended', self.endedHandler);
        self.player.on('play', function() {
          navigator.mediaSession.playbackState = 'playing';
          self.iconPlay.name = 'pause-circle';
          if (self.onStateChanged) self.onStateChanged(true);
        });
        self.player.on('pause', function() {
          navigator.mediaSession.playbackState = 'paused';
          self.iconPlay.name = 'play-circle';
          if (self.onStateChanged) self.onStateChanged(false);
        });
      })
    }
  }

  private initMediaSession() {
    if ("mediaSession" in navigator) {
      const self = this;
      let player = this.player;
      navigator.mediaSession.setActionHandler("play", async () => {
        await player.play();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        player.pause();
      });

      navigator.mediaSession.setActionHandler('previoustrack', function() {
        self.playPrevTrack();
      });

      navigator.mediaSession.setActionHandler('nexttrack', function() {
        self.playNextTrack();
      });

      // navigator.mediaSession.setActionHandler('seekbackward', function(event) {
      //   const skipTime = event.seekOffset || DEFAULT_SKIP_TIME;
      //   player.currentTime(Math.max(player.currentTime() - skipTime, 0));
      //   self.updatePositionState();
      // });

      // navigator.mediaSession.setActionHandler('seekforward', function(event) {
      //   const skipTime = event.seekOffset || DEFAULT_SKIP_TIME;
      //   player.currentTime(Math.min(player.currentTime() + skipTime, player.duration()));
      //   self.updatePositionState();
      // });

      try {
        navigator.mediaSession.setActionHandler('stop', function() {
          if (!player.paused()) player.pause();
          navigator.mediaSession.playbackState = "none";
        });
      } catch(error) {}
    }
  }

  render() {
    return (
      <i-panel
        id="playerWrapper"
        width="100%" height={'100%'}
        background={{color: Theme.background.paper}}
      >
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
          <i-video id="video" isStreaming={true} visible={false}></i-video>
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
      </i-panel>
    )
  }
}
