/// <amd-module name="@scom/scom-media-player/inteface.ts" />
declare module "@scom/scom-media-player/inteface.ts" {
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
}
/// <amd-module name="@scom/scom-media-player/common/playList.tsx" />
declare module "@scom/scom-media-player/common/playList.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    import { ITrack } from "@scom/scom-media-player/inteface.ts";
    interface ScomMediaPlayerPlaylistElement extends ControlElement {
        data?: IPlaylist;
        onItemClicked?: (data: ITrack) => void;
    }
    global {
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
    export class ScomMediaPlayerPlaylist extends Module {
        private pnlPlaylist;
        private lblTitle;
        private imgPlaylist;
        private pnlHeader;
        private lblDesc;
        private currentTrackEl;
        private _data;
        onItemClicked: (data: ITrack) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomMediaPlayerPlaylistElement, parent?: Container): Promise<ScomMediaPlayerPlaylist>;
        get tracks(): ITrack[];
        set tracks(value: ITrack[]);
        get title(): string;
        set title(value: string);
        get description(): string;
        set description(value: string);
        get picture(): string;
        set picture(value: string);
        get activeTrack(): number;
        set activeTrack(value: number);
        setData(data: IPlaylist): Promise<void>;
        clear(): void;
        private renderUI;
        private renderHeader;
        private renderTracks;
        private onTrackClick;
        private updateActiveTrack;
        togglePlay(value: boolean): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-media-player/common/index.css.ts" />
declare module "@scom/scom-media-player/common/index.css.ts" {
    export const customRangeStyle: string;
}
/// <amd-module name="@scom/scom-media-player/common/player.tsx" />
declare module "@scom/scom-media-player/common/player.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    import { ITrack } from "@scom/scom-media-player/inteface.ts";
    type callbackType = () => void;
    interface ScomMediaPlayerPlayerElement extends ControlElement {
        track?: ITrack;
        url?: string;
        onNext?: callbackType;
        onPrev?: callbackType;
        onStateChanged?: callbackType;
    }
    global {
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
    export class ScomMediaPlayerPlayer extends Module {
        private player;
        private video;
        private iconPlay;
        private iconRepeat;
        private imgTrack;
        private lblTrack;
        private lblArtist;
        private trackRange;
        private lblStart;
        private lblEnd;
        private pnlRange;
        private playerWrapper;
        private pnlInfo;
        private pnlControls;
        private pnlTimeline;
        private pnlRandom;
        private pnlRepeat;
        private playerGrid;
        private _data;
        private isMinimized;
        private isRepeat;
        onNext: callbackType;
        onPrev: callbackType;
        onStateChanged: callbackType;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomMediaPlayerPlayerElement, parent?: Container): Promise<ScomMediaPlayerPlayer>;
        get track(): ITrack;
        set track(value: ITrack);
        get url(): string;
        set url(value: string);
        get isPlaying(): boolean;
        setData(data: IPlayer): void;
        private endedHandler;
        private timeUpdateHandler;
        playTrack(track: ITrack): void;
        private playHandler;
        private updateMetadata;
        private updatePositionState;
        private getTrackType;
        private getTrackSrc;
        private renderTrack;
        private updateDuration;
        private togglePlay;
        private playNextTrack;
        private playPrevTrack;
        private onPlay;
        private onRepeat;
        private onShuffle;
        resizeLayout(mobile: boolean): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-media-player/common/index.ts" />
declare module "@scom/scom-media-player/common/index.ts" {
    export { ScomMediaPlayerPlaylist } from "@scom/scom-media-player/common/playList.tsx";
    export { ScomMediaPlayerPlayer } from "@scom/scom-media-player/common/player.tsx";
}
/// <amd-module name="@scom/scom-media-player/index.css.ts" />
declare module "@scom/scom-media-player/index.css.ts" {
    export const customVideoStyle: string;
    export const customScrollStyle: string;
}
/// <amd-module name="@scom/scom-media-player/utils.ts" />
declare module "@scom/scom-media-player/utils.ts" {
    export const isStreaming: (url: string) => boolean;
    export const getPath: (url: string) => string;
}
/// <amd-module name="@scom/scom-media-player" />
declare module "@scom/scom-media-player" {
    import { Module, Container, ControlElement, IDataSchema } from '@ijstech/components';
    interface ScomMediaPlayerElement extends ControlElement {
        url?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-media-player"]: ScomMediaPlayerElement;
            }
        }
    }
    export default class ScomMediaPlayer extends Module {
        private playList;
        private player;
        private videoEl;
        private playlistEl;
        private playerPanel;
        private parser;
        tag: any;
        private _theme;
        private _data;
        private parsedData;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomMediaPlayerElement, parent?: Container): Promise<ScomMediaPlayer>;
        get url(): string;
        set url(value: string);
        private setData;
        private getData;
        private loadLib;
        private renderUI;
        private checkParsedData;
        private isEmptyObject;
        private renderVideo;
        private renderPlaylist;
        private onPlay;
        private onNext;
        private onPrev;
        private onStateChanged;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                userInputDataSchema: IDataSchema;
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        private getPropertiesSchema;
        private _getActions;
        private getTag;
        private setTag;
        private updateTag;
        private updateStyle;
        private updateTheme;
        private resizeLayout;
        refresh(skipRefreshControls?: boolean): void;
        init(): void;
        render(): any;
    }
}
