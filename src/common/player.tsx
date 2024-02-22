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
  Control,
  GridLayout,
  Video
} from '@ijstech/components';
import { ITrack } from '../inteface';
const Theme = Styles.Theme.ThemeVars;

type callbackType = () => void;

interface ScomMediaPlayerPlayerElement extends ControlElement {
  track?: ITrack;
  url?: string;
  onNext?: callbackType;
  onPrev?: callbackType;
  onStateChanged?: callbackType;
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

@customElements('i-scom-media-player--player')
export class ScomMediaPlayerPlayer extends Module {
  private player: any;
  private video: Video;
  private iconPlay: Icon;
  private iconRepeat: Icon;
  private imgTrack: Image;
  private lblTrack: Label;
  private lblArtist: Label;
  private trackRange: Range;
  private lblStart: Label;
  private lblEnd: Label;
  private pnlRange: Panel;
  private playerWrapper: Panel;
  private pnlInfo: Panel;
  private pnlControls: Panel;
  private pnlTimeline: Panel;
  private pnlFooter: Panel;
  private pnlRandom: Panel;
  private pnlRepeat: Panel;
  private playerGrid: GridLayout;

  private _data: IPlayer;
  private isMinimized: boolean = false;
  private isRepeat: boolean = false;

  onNext: callbackType;
  onPrev: callbackType;
  onStateChanged: callbackType;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
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

  get isPlaying() {
    return this.player?.played() && !this.player?.paused();
  }

  async setData(data: IPlayer) {
    this.isMinimized = false;
    this._data = {...data};
  }

  onHide(): void {
    if (this.player) {
      this.player.off('timeupdate', this.timeUpdateHandler.bind(this));
      this.player.off('loadedmetadata', this.updateDuration.bind(this));
      this.player.off('ended', this.endedHandler.bind(this));
    }
  }

  private endedHandler() {
    this.iconPlay.name = 'play-circle';
    if (this.isRepeat) {
      this.player.play();
      this.iconPlay.name = 'pause-circle';
    } else {
      this.playNextTrack();
      this.iconPlay.name = 'pause-circle';
    }
  }

  private timeUpdateHandler() {
    const currentTime = this.player.currentTime() * 1000;
    if (this.trackRange) this.trackRange.value = currentTime;
    if (this.lblStart) this.lblStart.caption = moment(currentTime).format('mm:ss');
  }

  playTrack(track: ITrack) {
    if (!this.player) return;
    const self = this;
    if (this.track?.uri && this.track.uri === track.uri) {
      this.togglePlay();
    } else {
      this.player.pause();
      const uri = track.uri.trim();
      this.track = {...track};
      this.player.src({
        src: track.uri.startsWith('//') || track.uri.startsWith('http') ? uri : this.url + '/' + uri,
        type: self.getTrackType(track.uri)
      })
      this.player.ready(function() {
        self.renderTrack();
        self.player.play();
      });
      this.iconPlay.name = 'pause-circle';
    }
  }

  private getTrackType(url: string) {
    return url.endsWith('.mp3') ? 'audio/mp3' : 'application/x-mpegURL';
  }

  private renderTrack() {
    this.imgTrack.url = this.track?.poster || '';
    this.lblArtist.caption = this.track?.artist || 'No name';
    this.lblTrack.caption = this.track?.title || 'No title';
    this.updateDuration();
  }

  private updateDuration() {
    const duration = (this.player?.duration() || 0) * 1000;
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
    ></i-range>
    this.pnlRange.appendChild(this.trackRange);
    this.lblEnd.caption = moment(duration).format('mm:ss');
  }

  private togglePlay() {
    if (this.player.paused()) {
      this.player.play();
      this.iconPlay.name = 'pause-circle';
    } else {
      this.player.pause();
      this.iconPlay.name = 'play-circle';
    }
    if (this.onStateChanged) this.onStateChanged();
  }

  private playNextTrack() {
    if (this.onNext) this.onNext();
  }

  private playPrevTrack() {
    if (this.onPrev) this.onPrev();
  }

  private onPlay() {
    if (this.track) this.playTrack(this.track);
  }

  private onCollect() {}

  private onRepeat() {
    this.isRepeat = !this.isRepeat;
    this.iconRepeat.fill = this.isRepeat ? Theme.colors.success.main : Theme.text.primary;
  }

  private onShuffle() {
  }

  private onExpand(target: Control, event: MouseEvent) {
    event.stopPropagation();
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.playerWrapper.mediaQueries = [{
        maxWidth: '767px',
        properties: {
          position: 'fixed',
          bottom: '0.5rem',
          left: '0px',
          zIndex: 9999,
          maxHeight: '3.5rem'
        }
      }];
      this.playerGrid.mediaQueries = [{
        maxWidth: '767px',
        properties: {
          padding: {left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem'},
          gap: {row: '0px !important', column: '0.5rem !important'},
          templateColumns: ['2.5rem', 'minmax(auto, calc(100% - 11.5rem))', '9rem'],
          templateRows: ['1fr']
        }
      }];
      this.pnlTimeline.mediaQueries = [{
        maxWidth: '767px',
        properties: {visible: false, maxWidth: '100%'}
      }];
      this.pnlFooter.mediaQueries = [{
        maxWidth: '767px',
        properties: {visible: false, maxWidth: '100%'}
      }];
      this.imgTrack.mediaQueries = [ {
        maxWidth: '767px',
        properties: {
          maxWidth: '2.5rem',
          border: {radius: '50%'}
        }
      }];
      this.pnlRepeat.mediaQueries = [{
        maxWidth: '767px',
        properties: {visible: false, maxWidth: '100%'}
      }];
      this.pnlRandom.mediaQueries = [{
        maxWidth: '767px',
        properties: {visible: false, maxWidth: '100%'}
      }];
    } else {
      this.playerGrid.mediaQueries = [];
      this.playerWrapper.mediaQueries = [
        {
          maxWidth: '767px',
          properties: {
            position: 'fixed',
            left: '0px',
            bottom: '0px',
            zIndex: 9999,
            maxHeight: '100dvh'
          }
        }
      ];
      this.pnlTimeline.mediaQueries = [];
      this.pnlFooter.mediaQueries = [];
      this.imgTrack.mediaQueries = [];
      this.pnlRepeat.mediaQueries = [];
      this.pnlRandom.mediaQueries = [];
    }
  }

  private renderControls() {
    this.imgTrack = (
      <i-image
        id="imgTrack"
        width={'13rem'} height={'auto'}
        margin={{left: 'auto', right: 'auto'}}
        display='block'
        background={{color: Theme.background.modal}}
        mediaQueries={[
          {
            maxWidth: '767px',
            properties: {
              maxWidth: '2.5rem',
              border: {radius: '50%'}
            }
          }
        ]}
      ></i-image>
    )
    this.pnlInfo = (
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
          <i-label
            id="lblTrack"
            caption=''
            font={{weight: 600, size: 'clamp(1rem, 0.95rem + 0.25vw, 1.25rem)'}}
            lineHeight={'1.375rem'}
            maxWidth={'100%'}
            textOverflow='ellipsis'
          ></i-label>
          <i-label
            id="lblArtist"
            caption=''
            maxWidth={'100%'}
            textOverflow='ellipsis'
            font={{size: 'clamp(0.75rem, 0.7rem + 0.25vw, 1rem)'}}
          ></i-label>
        </i-vstack>
      </i-hstack>
    )
    this.pnlTimeline = (
      <i-vstack
        id="pnlTimeline"
        width={'100%'}
        mediaQueries={[
          {
            maxWidth: '767px',
            properties: {visible: false, maxWidth: '100%'}
          }
        ]}
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
    )
    this.pnlControls = (
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
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {visible: false, maxWidth: '100%'}
            }
          ]}
          onClick={() => this.onShuffle()}
        >
          <i-icon
            name="random"
            width={'1rem'}
            height={'1rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
        <i-grid-layout
          verticalAlignment="stretch"
          columnsPerRow={3}
          height={'3rem'}
          border={{radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider}}
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {
                border: {radius: '0px', width: '1px', style: 'none', color: Theme.divider}
              }
            }
          ]}
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
            onClick={() => this.onPlay()}
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
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {visible: false, maxWidth: '100%'}
            }
          ]}
        >
          <i-icon
            id="iconRepeat"
            name="redo"
            width={'0.875rem'} height={'0.875rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
      </i-hstack>
    )
    this.pnlFooter = (
      <i-hstack
        id="pnlFooter"
        verticalAlignment='center'
        horizontalAlignment='space-between'
        gap={'1.25rem'}
        width={'100%'}
        margin={{top: '1rem'}}
        mediaQueries={[
          {
            maxWidth: '767px',
            properties: {visible: false, maxWidth: '100%'}
          }
        ]}
      >
        <i-panel cursor='pointer' hover={{opacity: 0.5}}>
          <i-icon
            name="music"
            width={'1rem'} height={'1rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
        <i-hstack
          verticalAlignment="center"
          gap="0.25rem"
          cursor='pointer'
          onClick={this.onCollect}
        >
          <i-panel cursor='pointer' hover={{opacity: 0.5}}>
            <i-icon
              name="exclamation-circle"
              width={'1rem'} height={'1rem'}
              fill={Theme.text.primary}
            ></i-icon>
          </i-panel>
          <i-label
            caption='Collect'
            font={{size: '0.875rem', weight: 600}}
          ></i-label>
        </i-hstack>
        <i-panel cursor='pointer' hover={{opacity: 0.5}}>
          <i-icon
            name="share-alt"
            width={'1rem'} height={'1rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
      </i-hstack>
    )
    this.video = <i-video id="video" isStreaming={true} visible={false} url=""></i-video>

    this.playerGrid.append(this.imgTrack, this.video, this.pnlInfo, this.pnlControls, this.pnlTimeline, this.pnlFooter);
  }

  resizeLayout(mobile: boolean) {
  }

 async init() {
    super.init();
    this.onNext = this.getAttribute('onNext', true) || this.onNext;
    this.onPrev = this.getAttribute('onPrev', true) || this.onPrev;
    this.onStateChanged = this.getAttribute('onStateChanged', true) || this.onStateChanged;
    const track = this.getAttribute('track', true);
    const url = this.getAttribute('url', true);
    this.renderControls();
    this.setData({ track, url });
    this.player = await this.video.getPlayer();
    if (this.player) {
      this.player.on('timeupdate', this.timeUpdateHandler.bind(this));
      this.player.on('loadedmetadata', this.updateDuration.bind(this));
      this.player.on('ended', this.endedHandler.bind(this));
    }
  }

  render() {
    return (
      <i-panel
        id="playerWrapper"
        width="100%" height={'100%'}
        background={{color: Theme.background.paper}}
        mediaQueries={[
          {
            maxWidth: '767px',
            properties: {
              position: 'fixed',
              bottom: '0.5rem',
              left: '0px',
              zIndex: 9999,
              maxHeight: '3.5rem'
            }
          }
        ]}
      >
        <i-grid-layout
          id="playerGrid"
          gap={{row: '1rem', column: '0px'}}
          width="100%" height={'100%'}
          padding={{top: '1.25rem', bottom: '1.25rem', left: '1rem', right: '1rem'}}
          templateRows={['auto']}
          templateColumns={['1fr']}
          verticalAlignment='center'
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {
                padding: {left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem'},
                gap: {row: '0px !important', column: '0.5rem !important'},
                templateColumns: ['2.5rem', 'repeat(2, 1fr)'],
                templateRows: ['1fr']
              }
            }
          ]}
          onClick={this.onExpand}
        ></i-grid-layout>
      </i-panel>
    )
  }
}
