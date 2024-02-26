import {
  ControlElement,
  customElements,
  Module,
  Styles,
  Image,
  Label,
  Container,
  VStack,
  Control,
  Icon,
  Panel
} from '@ijstech/components';
import { ITrack } from '../inteface';
const Theme = Styles.Theme.ThemeVars;

interface ScomMediaPlayerPlaylistElement extends ControlElement {
  data?: IPlaylist;
  onItemClicked?: (data: ITrack) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-media-player--playlist']: ScomMediaPlayerPlaylistElement;
    }
  }
}

interface IPlaylist {
  title: string;
  description?: string;
  picture?: string;
  author?: string;
  tracks: ITrack[];
  activeTrack?: number;
}

@customElements('i-scom-media-player--playlist')
export class ScomMediaPlayerPlaylist extends Module {
  private pnlPlaylist: VStack;
  private lblTitle: Label;
  private imgPlaylist: Image;
  private pnlHeader: Panel;
  private lblDesc: Label;
  private currentTrackEl: Control;

  private _data: IPlaylist;

  onItemClicked: (data: ITrack) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomMediaPlayerPlaylistElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get tracks() {
    return this._data.tracks ?? [];
  }
  set tracks(value: ITrack[]) {
    this._data.tracks = value ?? [];
  }

  get title() {
    return this._data.title ?? '';
  }
  set title(value: string) {
    this._data.title = value ?? '';
  }

  get description() {
    return this._data.description ?? '';
  }
  set description(value: string) {
    this._data.description = value ?? '';
  }

  get picture() {
    return this._data.picture ?? '';
  }
  set picture(value: string) {
    this._data.picture = value ?? '';
  }

  get activeTrack() {
    return this._data.activeTrack ?? -1;
  }
  set activeTrack(value: number) {
    this._data.activeTrack = value ?? -1;
    this.updateActiveTrack(this.pnlPlaylist.children[this.activeTrack] as Control);
  }

  async setData(data: IPlaylist) {
    this._data = {...data};
    await this.renderUI();
  }

  clear() {
    this.pnlPlaylist.clearInnerHTML();
  }

  private async renderUI() {
    this.clear();
    this.renderHeader();
    this.renderTracks();
  }

  private renderHeader() {
    this.lblTitle.caption = this.title;
    this.lblDesc.caption = this.description;
    this.imgPlaylist.url = this.picture;
    this.pnlHeader.visible = !!(this.title || this.description || this.picture);
  }

  private renderTracks() {
    this.pnlPlaylist.clearInnerHTML();
    if (this.tracks.length) {
      for (let track of this.tracks) {
        const pnlTrack = (
          <i-hstack
            verticalAlignment='center'
            horizontalAlignment='space-between'
            gap={'0.75rem'}
            height={'3.313rem'}
            border={{radius: '0.5rem'}}
            margin={{top: '0.25rem', bottom: '0.25rem'}}
            padding={{left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem'}}
            background={{color: Theme.action.hoverBackground}}
            cursor='pointer'
            hover={{backgroundColor: Theme.background.main}}
            onClick={(target: Control) => this.onTrackClick(target, track)}
          >
            <i-hstack verticalAlignment='center' gap={'0.75rem'} height={'100%'}>
              <i-image
                url={track.poster || ''}
                stack={{shrink: '0'}}
                width={'2.5rem'} height={'2.5rem'}
                background={{color: Theme.background.modal}}
                objectFit={'cover'}
              ></i-image>
              <i-vstack gap="0.25rem" verticalAlignment='center'>
                <i-label
                  caption={track.title || 'No title'}
                  font={{size: '1rem'}}
                  wordBreak='break-all'
                  lineClamp={1}
                ></i-label>
                <i-label
                  caption={track.artist || 'No name'}
                  font={{size: '0.875rem', color: Theme.text.secondary}}
                  textOverflow='ellipsis'
                ></i-label>
              </i-vstack>
            </i-hstack>
            <i-panel hover={{opacity: 0.5}}>
              <i-icon name="angle-right" width={'1rem'} height={'1rem'} fill={Theme.text.primary}></i-icon>
            </i-panel>
          </i-hstack>
        )
        this.pnlPlaylist.appendChild(pnlTrack);
      }
    }
  }

  private onTrackClick(target: Control, track: ITrack) {
    if (this.currentTrackEl) {
      this.currentTrackEl.background.color = Theme.action.hoverBackground;
      const icon = this.currentTrackEl.querySelector('i-icon') as Icon;
      if (icon) icon.name = 'angle-right';
    }
    this.currentTrackEl = target;
    if (this.onItemClicked) this.onItemClicked(track);
  }

  private updateActiveTrack(target: Control) {
    if (this.currentTrackEl) {
      this.currentTrackEl.background.color = Theme.action.hoverBackground;
      const icon = this.currentTrackEl.querySelector('i-icon') as Icon;
      if (icon) icon.name = 'angle-right';
    }
    if (target) {
      target.background.color = Theme.action.activeBackground;
      const icon = target.querySelector('i-icon') as Icon;
      if (icon) icon.name = 'pause-circle';
      this.currentTrackEl = target;
    }
  }

  togglePlay(value: boolean) {
    if (this.currentTrackEl) {
      this.currentTrackEl.background.color = value ? Theme.action.activeBackground : Theme.action.hoverBackground;
      const icon = this.currentTrackEl.querySelector('i-icon') as Icon;
      if (icon) icon.name = value ? 'pause-circle' : 'angle-right';
    }
  }

  async init() {
    super.init();
    this.onItemClicked = this.getAttribute('onItemClicked', true) || this.onItemClicked;
    const data = this.getAttribute('data', true);
    if (data) await this.setData(data);
  }

  render() {
    return (
      <i-vstack width={'100%'} gap="1rem" padding={{top: '0.5rem'}}>
        <i-hstack
          id="pnlHeader"
          verticalAlignment='center' gap="0.5rem"
          background={{color: Theme.background.paper}}
          padding={{top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem'}}
        >
          <i-image
            id="imgPlaylist"
            url=""
            width={'8rem'} height={'auto'}
            objectFit={'cover'}
            border={{radius: '0.25rem'}}
            stack={{shrink: '0'}}
          ></i-image>
          <i-vstack gap="0.25rem">
            <i-label caption='' font={{size: '1.25rem'}} id='lblTitle'></i-label>
            <i-label caption='' font={{size: '0.875rem', color: Theme.text.secondary}} id='lblDesc'></i-label>
          </i-vstack>
        </i-hstack>
        {/* <i-hstack
          verticalAlignment='center'
          gap="1rem"
          padding={{top: '1rem', bottom: '1rem'}}
        >
          <i-panel hover={{opacity: 0.5}} cursor='pointer'>
            <i-icon name="share-alt" width={'1.25rem'} height={'1.25rem'} fill={Theme.text.primary}></i-icon>
          </i-panel>
          <i-panel hover={{opacity: 0.5}} cursor='pointer'>
            <i-icon name="heart" width={'1.25rem'} height={'1.25rem'} fill={Theme.text.primary}></i-icon>
          </i-panel>
        </i-hstack> */}
        <i-label caption='Tracks' font={{weight: 600, size: '1rem'}}></i-label>
        <i-vstack id="pnlPlaylist" margin={{ bottom: '0.75rem'}}></i-vstack>
      </i-vstack>
    );
  }
}
