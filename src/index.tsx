import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  Styles,
  Video,
  RequireJS,
  IDataSchema,
  application,
  StackLayout,
  Panel,
  GridLayout
} from '@ijstech/components'
import { ScomMediaPlayerPlayer, ScomMediaPlayerPlaylist } from './common/index'
import { ITrack } from './inteface'
import { aspectRatioStyle, customScrollStyle, customVideoStyle } from './index.css'
import { getPath, isStreaming } from './utils';

const Theme = Styles.Theme.ThemeVars;

interface ScomMediaPlayerElement extends ControlElement {
  url?: string;
}

interface IMediaPlayer {
  url: string;
}

const reqs = ['m3u8-parser'];
RequireJS.config({
  baseUrl: `${application.currentModuleDir}/lib`,
  paths: {
    'm3u8-parser': 'm3u8-parser.min'
  }
})

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
  private playList: ScomMediaPlayerPlaylist;
  private player: ScomMediaPlayerPlayer;
  private videoEl: Video;
  private playlistEl: GridLayout;
  private playerPanel: Panel;
  private parser: any;

  tag: any = {
    light: {},
    dark: {}
  }
  private _theme: string = 'light';
  private _data: IMediaPlayer = { url: ''};
  private parsedData: any = {};

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomMediaPlayerElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get url() {
    return this._data.url;
  }
  set url(value: string) {
    this._data.url = value;
  }

  private async setData(value: IMediaPlayer) {
    this._data = value;
    await this.renderUI();
  }

  private getData() {
    return this._data;
  }

  private async loadLib() {
    return new Promise((resolve, reject) => {
      RequireJS.require(reqs, function (m3u8Parser: any) {
        resolve(new m3u8Parser.Parser());
      });
    })
  }

  private async renderUI() {
    if (!this.url || !isStreaming(this.url)) return;
    if (!this.parser) {
      this.parser = await this.loadLib();
    }
    const result = await fetch(this.url);
    const manifest = await result.text();

    this.parser.push(manifest);
    this.parser.end();
    this.parsedData = this.parser.manifest;
    console.log(this.parser.manifest)
    this.player.setData({ url: getPath(this.url) });
    this.checkParsedData();
  }

  private checkParsedData() {
    if (!this.parsedData) return;
    // TODO: check
    const playlists = this.parsedData.playlists || [];
    const segments = this.parsedData.segments || [];
    const isStreamVideo = segments.every(segment => /\.ts$/.test(segment.uri || ''));
    const isVideo = playlists.some(playlist => playlist.attributes.RESOLUTION);
    if ((playlists.length && !isVideo) || (segments.length && !isStreamVideo)) {
      let value = [...playlists];
      const haveAudioGroup = !this.isEmptyObject(this.parsedData?.mediaGroups?.AUDIO);
      const isAudioOnly = playlists.length && playlists.every(playlist => !playlist.attributes.RESOLUTION);
      if (isAudioOnly && haveAudioGroup) {
        value = [{ uri: this.url, title: '' }];
      } else if (!isStreamVideo) {
        value = [...segments];
      }
      this.renderPlaylist(value);
    } else {
      this.renderVideo();
    }
  }

  private isEmptyObject(value: any) {
    if (!value) return true;
    return Object.keys(value).length === 0;
  }

  private renderVideo() {
    this.playlistEl.visible = false;
    this.videoEl.visible = true;
    this.videoEl.url = this.url;
  }

  private renderPlaylist(tracks: any[]) {
    this.playlistEl.visible = true;
    this.videoEl.visible = false;
    this.playList.setData({
      tracks,
      title: this.parsedData?.title || '',
      description: '',
      picture: ''
    });
  }

  private onPlay(data: ITrack) {
    if (!data) return;
    this.player.playTrack(data);
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

  private onStateChanged() {
    this.playList.togglePlay(this.player.isPlaying);
  }

  getConfigurators() {
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          return this._getActions();
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private getPropertiesSchema() {
    const schema: IDataSchema = {
      type: "object",
      required: ["url"],
      properties: {
        url: {
          type: "string"
        }
      }
    };
    return schema;
  }

  private _getActions() {
    const propertiesSchema = this.getPropertiesSchema();
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData = {url: ''};
          return {
            execute: () => {
              oldData = {...this._data};
              if (userInputData?.url) this._data.url = userInputData.url;
              this.renderUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = {...oldData};
              this.renderUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => {}
          }
        },
        userInputDataSchema: propertiesSchema as IDataSchema
      }
    ]
    return actions
  }

  private getTag() {
    return this.tag;
  }

  private setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.tag[prop] = newValue[prop];
      }
    }
    this.updateTheme();
    this.resizeLayout();
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.tag[type][prop] = value[prop];
    }
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this._theme || document.body.style.getPropertyValue('--theme');
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--text-secondary', this.tag[themeVar]?.secondaryColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--colors-primary-main', this.tag[themeVar]?.primaryColor);
    this.updateStyle('--colors-primary-light', this.tag[themeVar]?.primaryLightColor);
    this.updateStyle('--colors-primary-dark', this.tag[themeVar]?.primaryDarkColor);
    this.updateStyle('--colors-secondary-light', this.tag[themeVar]?.secondaryLight);
    this.updateStyle('--colors-secondary-main', this.tag[themeVar]?.secondaryMain);
    this.updateStyle('--divider', this.tag[themeVar]?.borderColor);
    this.updateStyle('--action-selected', this.tag[themeVar]?.selected);
    this.updateStyle('--action-selected_background', this.tag[themeVar]?.selectedBackground);
    this.updateStyle('--action-hover_background', this.tag[themeVar]?.hoverBackground);
    this.updateStyle('--action-hover', this.tag[themeVar]?.hover);
  }

  private resizeLayout() {
    if (this.offsetWidth <= 0) return;
    const tagWidth = Number(this.tag?.width);
    const hasSmallWidth = (this.offsetWidth !== 0 && this.offsetWidth < 550) || (window as any).innerWidth < 550 || (!isNaN(tagWidth) && tagWidth !== 0 && tagWidth < 550);
    if (hasSmallWidth) {
      this.playlistEl.templateColumns = ['auto'];
      this.playlistEl.templateAreas = [['player'], ['playlist']];

      this.playerPanel.padding = {top: 0, bottom: 0, left: 0, right: 0};
      this.player.resizeLayout(true);
    } else {
      this.playlistEl.templateColumns = ['repeat(2, 1fr)'];
      this.playlistEl.templateAreas = [['playlist', 'player']];

      this.playerPanel.padding = {top: '1rem', bottom: '1rem', left: '2.5rem', right: '2.5rem'};
      this.player.resizeLayout(false);
    }
  }

  refresh(skipRefreshControls?: boolean): void {
    super.refresh(skipRefreshControls);
    this.resizeLayout();
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
        background={{color: Theme.background.main}}
      >
        <i-video
          id="videoEl"
          isStreaming
          margin={{left: 'auto', right: 'auto'}}
          display='block'
          minWidth={'50%'}
          url=""
          stack={{grow: '1', shrink: '1'}}
          class={customVideoStyle}
          visible={false}
        ></i-video>
        <i-grid-layout
          id="playlistEl"
          position='relative'
          maxHeight={'100%'}
          stack={{grow: '1', shrink: '1'}}
          templateColumns={['repeat(2, 1fr)']}
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
            padding={{left: '1rem', right: '1rem'}}
            width={'100%'} height={'100%'}
            overflow={{y: 'auto'}}
            grid={{area: 'playlist'}}
            class={customScrollStyle}
            onItemClicked={this.onPlay}
          />
          <i-panel
            id="playerPanel"
            padding={{top: '1rem', bottom: '1rem', left: '2.5rem', right: '2.5rem'}}
            width={'100%'} height={'100%'}
            grid={{area: 'player'}}
            mediaQueries={[
              {
                maxWidth: '767px',
                properties: {
                  padding: {top: 0, bottom: 0, left: 0, right: 0},
                  maxHeight: '0px'
                }
              }
            ]}
          >
            <i-scom-media-player--player
              id="player"
              display='block'
              width={'100%'} height={'100%'}
              background={{color: Theme.background.paper}}
              // class={aspectRatioStyle}
              onNext={this.onNext}
              onPrev={this.onPrev}
              onStateChanged={this.onStateChanged}
            />
          </i-panel>
        </i-grid-layout>
      </i-hstack>
    )
  }
}
