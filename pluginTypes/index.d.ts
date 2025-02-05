/// <reference path="@ijstech/components/index.d.ts" />
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
    export interface IMediaPlayer {
        url: string;
    }
}
/// <amd-module name="@scom/scom-media-player/common/index.css.ts" />
declare module "@scom/scom-media-player/common/index.css.ts" {
    export const customRangeStyle: string;
    export const marqueeStyle: string;
    export const trackStyle: string;
    export const customVideoStyle: string;
}
/// <amd-module name="@scom/scom-media-player/utils.ts" />
declare module "@scom/scom-media-player/utils.ts" {
    export const isStreaming: (url: string) => boolean;
    export const isAudio: (url: string) => boolean;
    export const getPath: (url: string) => string;
    export const formatTime: (time: number | string) => string;
}
/// <amd-module name="@scom/scom-media-player/translations.json.ts" />
declare module "@scom/scom-media-player/translations.json.ts" {
    const _default: {
        en: {
            no_title: string;
            no_name: string;
            tracks: string;
        };
        "zh-hant": {
            no_title: string;
            no_name: string;
            tracks: string;
        };
        vi: {
            no_title: string;
            no_name: string;
            tracks: string;
        };
    };
    export default _default;
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
/// <amd-module name="@scom/scom-media-player/common/player.tsx" />
declare module "@scom/scom-media-player/common/player.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    import { ITrack } from "@scom/scom-media-player/inteface.ts";
    type callbackType = () => void;
    type changedCallbackType = (value: boolean) => void;
    type MediaType = 'video' | 'playlist' | 'audio';
    interface ScomMediaPlayerPlayerElement extends ControlElement {
        url?: string;
        type?: MediaType;
        onNext?: callbackType;
        onPrev?: callbackType;
        onRandom?: callbackType;
        onStateChanged?: changedCallbackType;
    }
    global {
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
    export class ScomMediaPlayerPlayer extends Module {
        private player;
        private video;
        private iconPlay;
        private iconRepeat;
        private iconShuffle;
        private imgTrack;
        private lblTrack;
        private lblArtist;
        private trackRange;
        private lblStart;
        private lblEnd;
        private pnlRange;
        private playerGrid;
        private pnlPrevNext;
        private pnlNext;
        private pnlPrev;
        private pnlRandom;
        private pnlRepeat;
        private pnlInfo;
        private timeLineGrid;
        private pnlMute;
        private iconMute;
        private sliderVolume;
        private pnlControls;
        private _data;
        private isRepeat;
        private isShuffle;
        private currentTrack;
        private notUpdate;
        private firstClick;
        private isMute;
        onNext: callbackType;
        onPrev: callbackType;
        onRandom: callbackType;
        onStateChanged: changedCallbackType;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomMediaPlayerPlayerElement, parent?: Container): Promise<ScomMediaPlayerPlayer>;
        get url(): string;
        set url(value: string);
        get type(): MediaType;
        set type(value: MediaType);
        get track(): ITrack;
        setData(data: IPlayer): void;
        private renderUI;
        private toggleUIs;
        clear(): void;
        pause(): void;
        playTrack(track: ITrack): void;
        private togglePlay;
        private getTrackType;
        private getTrackSrc;
        private renderTrack;
        private updateDuration;
        private playNextTrack;
        private playPrevTrack;
        private playRandomTrack;
        private onPlay;
        private pauseOthers;
        private onRepeat;
        private onShuffle;
        private onMute;
        private onVolume;
        resizeLayout(mobile: boolean): void;
        init(): Promise<void>;
        private initEvents;
        private playHandler;
        private playingHandler;
        private pauseHandler;
        private endedHandler;
        private timeUpdateHandler;
        private addMediaSessionEvents;
        private updateSessionData;
        private updateMetadata;
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
    export const customScrollStyle: string;
}
/// <amd-module name="@scom/scom-media-player/model.ts" />
declare module "@scom/scom-media-player/model.ts" {
    import { IDataSchema, Module } from '@ijstech/components';
    import { IMediaPlayer } from "@scom/scom-media-player/inteface.ts";
    interface IModelOptions {
        updateWidget: () => Promise<void>;
        resize: () => void;
    }
    export class Model {
        private module;
        private options;
        private _data;
        private _theme;
        private _parsedData;
        constructor(module: Module, options: IModelOptions);
        get url(): string;
        set url(value: string);
        get parsedData(): any;
        getData(): IMediaPlayer;
        setData(value: IMediaPlayer): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        private updateTag;
        private updateStyle;
        private updateTheme;
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
        private loadLib;
        handleStreamData(): Promise<void>;
        isEmptyObject(value: any): boolean;
    }
}
/// <amd-module name="@scom/scom-media-player" />
declare module "@scom/scom-media-player" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IMediaPlayer } from "@scom/scom-media-player/inteface.ts";
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
        private model;
        private playList;
        private player;
        private playlistEl;
        private playerPanel;
        tag: any;
        private isVideo;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomMediaPlayerElement, parent?: Container): Promise<ScomMediaPlayer>;
        get url(): string;
        set url(value: string);
        private get parsedData();
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
                userInputDataSchema: import("@ijstech/components").IDataSchema;
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        getTag(): any;
        setTag(value: any): void;
        private setData;
        getData(): IMediaPlayer;
        private renderUI;
        private renderStreamData;
        private renderAudio;
        private checkParsedData;
        private renderVideo;
        private renderPlaylist;
        onHide(): void;
        private onPlay;
        private onNext;
        private onPrev;
        private onRandom;
        private onStateChanged;
        private resizeLayout;
        refresh(skipRefreshControls?: boolean): void;
        private initModel;
        init(): void;
        render(): any;
    }
}
