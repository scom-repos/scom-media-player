var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-media-player/inteface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-media-player/common/playList.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomMediaPlayerPlaylist = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    let ScomMediaPlayerPlaylist = class ScomMediaPlayerPlaylist extends components_1.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get tracks() {
            return this._data.tracks ?? [];
        }
        set tracks(value) {
            this._data.tracks = value ?? [];
        }
        get title() {
            return this._data.title ?? '';
        }
        set title(value) {
            this._data.title = value ?? '';
        }
        get description() {
            return this._data.description ?? '';
        }
        set description(value) {
            this._data.description = value ?? '';
        }
        get picture() {
            return this._data.picture ?? '';
        }
        set picture(value) {
            this._data.picture = value ?? '';
        }
        get activeTrack() {
            return this._data.activeTrack ?? -1;
        }
        set activeTrack(value) {
            this._data.activeTrack = value ?? -1;
            this.updateActiveTrack(this.pnlPlaylist.children[this.activeTrack]);
        }
        async setData(data) {
            this._data = { ...data };
            await this.renderUI();
        }
        clear() {
            this.pnlPlaylist.clearInnerHTML();
        }
        async renderUI() {
            this.clear();
            this.renderHeader();
            this.renderTracks();
        }
        renderHeader() {
            this.lblTitle.caption = this.title;
            this.lblDesc.caption = this.description;
            this.imgPlaylist.url = this.picture;
            this.pnlHeader.visible = !!(this.title || this.description || this.picture);
        }
        renderTracks() {
            this.pnlPlaylist.clearInnerHTML();
            if (this.tracks.length) {
                for (let track of this.tracks) {
                    const pnlTrack = (this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '0.75rem', height: '3.313rem', border: { radius: '0.5rem' }, margin: { top: '0.25rem', bottom: '0.25rem' }, padding: { left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem' }, background: { color: Theme.action.hoverBackground }, cursor: 'pointer', hover: { backgroundColor: Theme.background.main }, onClick: (target) => this.onTrackClick(target, track) },
                        this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.75rem', height: '100%' },
                            this.$render("i-image", { url: track.poster || '', stack: { shrink: '0' }, width: '2.5rem', height: '2.5rem', background: { color: Theme.background.modal }, objectFit: 'cover' }),
                            this.$render("i-vstack", { gap: "0.25rem", verticalAlignment: 'center' },
                                this.$render("i-label", { caption: track.title || 'No title', font: { size: '1rem' }, wordBreak: 'break-all', lineClamp: 1 }),
                                this.$render("i-label", { caption: track.artist || 'No name', font: { size: '0.875rem', color: Theme.text.secondary }, textOverflow: 'ellipsis' }))),
                        this.$render("i-panel", { hover: { opacity: 0.5 } },
                            this.$render("i-icon", { name: "angle-right", width: '1rem', height: '1rem', fill: Theme.text.primary }))));
                    this.pnlPlaylist.appendChild(pnlTrack);
                }
            }
        }
        onTrackClick(target, track) {
            this.updateActiveTrack(target);
            if (this.onItemClicked)
                this.onItemClicked(track);
        }
        updateActiveTrack(target) {
            if (this.currentTrackEl) {
                this.currentTrackEl.background.color = Theme.action.hoverBackground;
                const icon = this.currentTrackEl.querySelector('i-icon');
                if (icon)
                    icon.name = 'angle-right';
            }
            if (target) {
                target.background.color = Theme.action.activeBackground;
                const icon = target.querySelector('i-icon');
                if (icon)
                    icon.name = 'pause-circle';
                this.currentTrackEl = target;
            }
        }
        togglePlay(value) {
            if (this.currentTrackEl) {
                this.currentTrackEl.background.color = value ? Theme.action.activeBackground : Theme.action.hoverBackground;
                const icon = this.currentTrackEl.querySelector('i-icon');
                if (icon)
                    icon.name = value ? 'pause-circle' : 'angle-right';
            }
        }
        async init() {
            super.init();
            this.onItemClicked = this.getAttribute('onItemClicked', true) || this.onItemClicked;
            const data = this.getAttribute('data', true);
            if (data)
                await this.setData(data);
        }
        render() {
            return (this.$render("i-vstack", { width: '100%', gap: "1rem" },
                this.$render("i-hstack", { id: "pnlHeader", verticalAlignment: 'center', gap: "0.5rem", background: { color: Theme.background.paper }, padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' } },
                    this.$render("i-image", { id: "imgPlaylist", url: "", width: '8rem', height: 'auto', objectFit: 'cover', border: { radius: '0.25rem' }, stack: { shrink: '0' } }),
                    this.$render("i-vstack", { gap: "0.25rem" },
                        this.$render("i-label", { caption: '', font: { size: '1.25rem' }, id: 'lblTitle' }),
                        this.$render("i-label", { caption: '', font: { size: '0.875rem', color: Theme.text.secondary }, id: 'lblDesc' }))),
                this.$render("i-hstack", { verticalAlignment: 'center', gap: "1rem", padding: { top: '1rem', bottom: '1rem' } },
                    this.$render("i-panel", { hover: { opacity: 0.5 }, cursor: 'pointer' },
                        this.$render("i-icon", { name: "share-alt", width: '1.25rem', height: '1.25rem', fill: Theme.text.primary })),
                    this.$render("i-panel", { hover: { opacity: 0.5 }, cursor: 'pointer' },
                        this.$render("i-icon", { name: "heart", width: '1.25rem', height: '1.25rem', fill: Theme.text.primary }))),
                this.$render("i-label", { caption: 'Tracks', font: { weight: 600, size: '1rem' } }),
                this.$render("i-vstack", { id: "pnlPlaylist", margin: { top: '0.75rem', bottom: '0.75rem' } })));
        }
    };
    ScomMediaPlayerPlaylist = __decorate([
        (0, components_1.customElements)('i-scom-media-player--playlist')
    ], ScomMediaPlayerPlaylist);
    exports.ScomMediaPlayerPlaylist = ScomMediaPlayerPlaylist;
});
define("@scom/scom-media-player/common/player.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomMediaPlayerPlayer = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomMediaPlayerPlayer = class ScomMediaPlayerPlayer extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.isMinimized = false;
            this.isRepeat = false;
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get track() {
            return this._data.track;
        }
        set track(value) {
            this._data.track = value;
        }
        get url() {
            return this._data.url ?? '';
        }
        set url(value) {
            this._data.url = value ?? '';
        }
        get isPlaying() {
            return this.player?.played() && !this.player?.paused();
        }
        async setData(data) {
            this.isMinimized = false;
            this._data = { ...data };
        }
        onHide() {
            if (this.player) {
                this.player.off('timeupdate', this.timeUpdateHandler.bind(this));
                this.player.off('loadedmetadata', this.updateDuration.bind(this));
                this.player.off('ended', this.endedHandler.bind(this));
            }
        }
        endedHandler() {
            this.iconPlay.name = 'play-circle';
            if (this.isRepeat) {
                this.player.play();
                this.iconPlay.name = 'pause-circle';
            }
            else {
                this.playNextTrack();
                this.iconPlay.name = 'pause-circle';
            }
        }
        timeUpdateHandler() {
            const currentTime = this.player.currentTime() * 1000;
            if (this.trackRange)
                this.trackRange.value = currentTime;
            if (this.lblStart)
                this.lblStart.caption = (0, components_2.moment)(currentTime).format('mm:ss');
        }
        playTrack(track) {
            if (!this.player)
                return;
            const self = this;
            if (this.track?.uri && this.track.uri === track.uri) {
                this.togglePlay();
            }
            else {
                this.player.pause();
                const uri = track.uri.trim();
                this.track = { ...track };
                this.player.src({
                    src: track.uri.startsWith('//') || track.uri.startsWith('http') ? uri : this.url + '/' + uri,
                    type: self.getTrackType(track.uri)
                });
                this.player.ready(function () {
                    self.renderTrack();
                    self.player.play();
                });
                this.iconPlay.name = 'pause-circle';
            }
        }
        getTrackType(url) {
            return url.endsWith('.mp3') ? 'audio/mp3' : 'application/x-mpegURL';
        }
        renderTrack() {
            this.imgTrack.url = this.track?.poster || '';
            this.lblArtist.caption = this.track?.artist || 'No name';
            this.lblTrack.caption = this.track?.title || 'No title';
            this.updateDuration();
        }
        updateDuration() {
            const duration = (this.player?.duration() || 0) * 1000;
            this.lblEnd.caption = '00:00';
            if (duration <= 0 || !Number.isFinite(duration))
                return;
            this.pnlRange.clearInnerHTML();
            this.trackRange = this.$render("i-range", { min: 0, max: duration, value: 0, step: 1, width: '100%', onChanged: () => {
                    this.player.currentTime(this.trackRange.value / 1000);
                    this.lblStart.caption = (0, components_2.moment)(this.trackRange.value).format('mm:ss');
                } });
            this.pnlRange.appendChild(this.trackRange);
            this.lblEnd.caption = (0, components_2.moment)(duration).format('mm:ss');
        }
        togglePlay() {
            if (this.player.paused()) {
                this.player.play();
                this.iconPlay.name = 'pause-circle';
            }
            else {
                this.player.pause();
                this.iconPlay.name = 'play-circle';
            }
            if (this.onStateChanged)
                this.onStateChanged();
        }
        playNextTrack() {
            if (this.onNext)
                this.onNext();
        }
        playPrevTrack() {
            if (this.onPrev)
                this.onPrev();
        }
        onPlay() {
            if (this.track)
                this.playTrack(this.track);
        }
        onCollect() { }
        onRepeat() {
            this.isRepeat = !this.isRepeat;
            this.iconRepeat.fill = this.isRepeat ? Theme.colors.success.main : Theme.text.primary;
        }
        onShuffle() {
        }
        onExpand(target, event) {
            event.stopPropagation();
            if (!window.matchMedia('(max-width: 767px)').matches)
                return;
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
                            padding: { left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem' },
                            gap: { row: '0px !important', column: '0.5rem !important' },
                            templateColumns: ['2.5rem', 'minmax(auto, calc(100% - 11.5rem))', '9rem'],
                            templateRows: ['1fr']
                        }
                    }];
                this.pnlTimeline.mediaQueries = [{
                        maxWidth: '767px',
                        properties: { visible: false, maxWidth: '100%' }
                    }];
                this.pnlFooter.mediaQueries = [{
                        maxWidth: '767px',
                        properties: { visible: false, maxWidth: '100%' }
                    }];
                this.imgTrack.mediaQueries = [{
                        maxWidth: '767px',
                        properties: {
                            maxWidth: '2.5rem',
                            border: { radius: '50%' }
                        }
                    }];
                this.pnlRepeat.mediaQueries = [{
                        maxWidth: '767px',
                        properties: { visible: false, maxWidth: '100%' }
                    }];
                this.pnlRandom.mediaQueries = [{
                        maxWidth: '767px',
                        properties: { visible: false, maxWidth: '100%' }
                    }];
            }
            else {
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
        renderControls() {
            this.imgTrack = (this.$render("i-image", { id: "imgTrack", width: '13rem', height: 'auto', margin: { left: 'auto', right: 'auto' }, display: 'block', background: { color: Theme.background.modal }, mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            maxWidth: '2.5rem',
                            border: { radius: '50%' }
                        }
                    }
                ] }));
            this.pnlInfo = (this.$render("i-hstack", { id: "pnlInfo", horizontalAlignment: 'space-between', verticalAlignment: 'center', margin: { top: '1rem', bottom: '1rem' }, width: '100%', overflow: 'hidden', mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            margin: { top: 0, bottom: 0 }
                        }
                    }
                ] },
                this.$render("i-vstack", { gap: "0.25rem", verticalAlignment: 'center', maxWidth: '100%' },
                    this.$render("i-label", { id: "lblTrack", caption: '', font: { weight: 600, size: 'clamp(1rem, 0.95rem + 0.25vw, 1.25rem)' }, lineHeight: '1.375rem', maxWidth: '100%', textOverflow: 'ellipsis' }),
                    this.$render("i-label", { id: "lblArtist", caption: '', maxWidth: '100%', textOverflow: 'ellipsis', font: { size: 'clamp(0.75rem, 0.7rem + 0.25vw, 1rem)' } }))));
            this.pnlTimeline = (this.$render("i-vstack", { id: "pnlTimeline", width: '100%', mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: { visible: false, maxWidth: '100%' }
                    }
                ] },
                this.$render("i-panel", { id: "pnlRange", stack: { 'grow': '1', 'shrink': '1' } }),
                this.$render("i-hstack", { horizontalAlignment: 'space-between', gap: "0.25rem" },
                    this.$render("i-label", { id: "lblStart", caption: '0:00', font: { size: '0.875rem' } }),
                    this.$render("i-label", { id: 'lblEnd', caption: '0:00', font: { size: '0.875rem' } }))));
            this.pnlControls = (this.$render("i-hstack", { id: "pnlControls", verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '1.25rem', width: '100%', mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            gap: '0.5rem'
                        }
                    }
                ] },
                this.$render("i-panel", { id: "pnlRandom", cursor: 'pointer', hover: { opacity: 0.5 }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: { visible: false, maxWidth: '100%' }
                        }
                    ], onClick: () => this.onShuffle() },
                    this.$render("i-icon", { name: "random", width: '1rem', height: '1rem', fill: Theme.text.primary })),
                this.$render("i-grid-layout", { verticalAlignment: "stretch", columnsPerRow: 3, height: '3rem', border: { radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                border: { radius: '0px', width: '1px', style: 'none', color: Theme.divider }
                            }
                        }
                    ], stack: { grow: '1', shrink: '1' } },
                    this.$render("i-vstack", { verticalAlignment: 'center', horizontalAlignment: 'center', cursor: 'pointer', hover: { opacity: 0.5 }, onClick: () => this.playPrevTrack() },
                        this.$render("i-icon", { name: "step-backward", width: '1rem', height: '1rem', fill: Theme.text.primary })),
                    this.$render("i-vstack", { verticalAlignment: 'center', horizontalAlignment: 'center', cursor: 'pointer', hover: { opacity: 0.5 }, onClick: () => this.onPlay() },
                        this.$render("i-icon", { id: "iconPlay", name: "play-circle", width: '1.75rem', height: '1.75rem', fill: Theme.text.primary })),
                    this.$render("i-vstack", { verticalAlignment: 'center', horizontalAlignment: 'center', cursor: 'pointer', hover: { opacity: 0.5 }, onClick: () => this.playNextTrack() },
                        this.$render("i-icon", { name: "step-forward", width: '1rem', height: '1rem', fill: Theme.text.primary }))),
                this.$render("i-panel", { id: "pnlRepeat", cursor: 'pointer', hover: { opacity: 0.5 }, onClick: () => this.onRepeat(), mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: { visible: false, maxWidth: '100%' }
                        }
                    ] },
                    this.$render("i-icon", { id: "iconRepeat", name: "redo", width: '0.875rem', height: '0.875rem', fill: Theme.text.primary }))));
            this.pnlFooter = (this.$render("i-hstack", { id: "pnlFooter", verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '1.25rem', width: '100%', margin: { top: '1rem' }, mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: { visible: false, maxWidth: '100%' }
                    }
                ] },
                this.$render("i-panel", { cursor: 'pointer', hover: { opacity: 0.5 } },
                    this.$render("i-icon", { name: "music", width: '1rem', height: '1rem', fill: Theme.text.primary })),
                this.$render("i-hstack", { verticalAlignment: "center", gap: "0.25rem", cursor: 'pointer', onClick: this.onCollect },
                    this.$render("i-panel", { cursor: 'pointer', hover: { opacity: 0.5 } },
                        this.$render("i-icon", { name: "exclamation-circle", width: '1rem', height: '1rem', fill: Theme.text.primary })),
                    this.$render("i-label", { caption: 'Collect', font: { size: '0.875rem', weight: 600 } })),
                this.$render("i-panel", { cursor: 'pointer', hover: { opacity: 0.5 } },
                    this.$render("i-icon", { name: "share-alt", width: '1rem', height: '1rem', fill: Theme.text.primary }))));
            this.video = this.$render("i-video", { id: "video", isStreaming: true, visible: false, url: "" });
            this.playerGrid.append(this.imgTrack, this.video, this.pnlInfo, this.pnlControls, this.pnlTimeline, this.pnlFooter);
        }
        resizeLayout(mobile) {
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
            return (this.$render("i-panel", { id: "playerWrapper", width: "100%", height: '100%', background: { color: Theme.background.paper }, mediaQueries: [
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
                ] },
                this.$render("i-grid-layout", { id: "playerGrid", gap: { row: '1rem', column: '0px' }, width: "100%", height: '100%', padding: { top: '1.25rem', bottom: '1.25rem', left: '1rem', right: '1rem' }, templateRows: ['auto'], templateColumns: ['1fr'], verticalAlignment: 'center', mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                padding: { left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem' },
                                gap: { row: '0px !important', column: '0.5rem !important' },
                                templateColumns: ['2.5rem', 'repeat(2, 1fr)'],
                                templateRows: ['1fr']
                            }
                        }
                    ], onClick: this.onExpand })));
        }
    };
    ScomMediaPlayerPlayer = __decorate([
        (0, components_2.customElements)('i-scom-media-player--player')
    ], ScomMediaPlayerPlayer);
    exports.ScomMediaPlayerPlayer = ScomMediaPlayerPlayer;
});
define("@scom/scom-media-player/common/index.ts", ["require", "exports", "@scom/scom-media-player/common/playList.tsx", "@scom/scom-media-player/common/player.tsx"], function (require, exports, playList_1, player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomMediaPlayerPlayer = exports.ScomMediaPlayerPlaylist = void 0;
    Object.defineProperty(exports, "ScomMediaPlayerPlaylist", { enumerable: true, get: function () { return playList_1.ScomMediaPlayerPlaylist; } });
    Object.defineProperty(exports, "ScomMediaPlayerPlayer", { enumerable: true, get: function () { return player_1.ScomMediaPlayerPlayer; } });
});
define("@scom/scom-media-player/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.customScrollStyle = exports.customVideoStyle = exports.aspectRatioStyle = void 0;
    exports.aspectRatioStyle = components_3.Styles.style({
        aspectRatio: '0.58 / 1'
    });
    exports.customVideoStyle = components_3.Styles.style({
        $nest: {
            'i-video video': {
                aspectRatio: '16 / 9'
            }
        }
    });
    exports.customScrollStyle = components_3.Styles.style({
        $nest: {
            '&::-webkit-scrollbar-track': {
                borderRadius: '4px',
                border: '1px solid transparent',
                backgroundColor: 'unset'
            },
            '&::-webkit-scrollbar': {
                width: '4px',
                backgroundColor: 'unset'
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '4px',
                background: 'var(--background-default) 0% 0% no-repeat padding-box'
            },
        }
    });
});
define("@scom/scom-media-player/utils.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPath = exports.isStreaming = void 0;
    ///<amd-module name='@scom/scom-media-player/utils.ts'/> 
    const isStreaming = (url) => {
        const ext = url.split('.').pop();
        return ext === 'm3u8' || ext === 'm3u';
    };
    exports.isStreaming = isStreaming;
    const getPath = (url) => {
        return url.split('/').slice(0, -1).join('/');
    };
    exports.getPath = getPath;
});
define("@scom/scom-media-player", ["require", "exports", "@ijstech/components", "@scom/scom-media-player/index.css.ts", "@scom/scom-media-player/utils.ts"], function (require, exports, components_4, index_css_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    const reqs = ['m3u8-parser'];
    components_4.RequireJS.config({
        baseUrl: `${components_4.application.currentModuleDir}/lib`,
        paths: {
            'm3u8-parser': 'm3u8-parser.min'
        }
    });
    const MAX_WIDTH = 700;
    let ScomMediaPlayer = class ScomMediaPlayer extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.tag = {
                light: {},
                dark: {}
            };
            this._theme = 'light';
            this._data = { url: '' };
            this.parsedData = {};
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get url() {
            return this._data.url;
        }
        set url(value) {
            this._data.url = value;
        }
        async setData(value) {
            this._data = value;
            await this.renderUI();
        }
        getData() {
            return this._data;
        }
        async loadLib() {
            return new Promise((resolve, reject) => {
                components_4.RequireJS.require(reqs, function (m3u8Parser) {
                    resolve(new m3u8Parser.Parser());
                });
            });
        }
        async renderUI() {
            if (!this.url || !(0, utils_1.isStreaming)(this.url))
                return;
            if (!this.parser) {
                this.parser = await this.loadLib();
            }
            const result = await fetch(this.url);
            const manifest = await result.text();
            this.parser.push(manifest);
            this.parser.end();
            this.parsedData = this.parser.manifest;
            console.log(this.parser.manifest);
            this.player.setData({ url: (0, utils_1.getPath)(this.url) });
            this.checkParsedData();
        }
        checkParsedData() {
            if (!this.parsedData)
                return;
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
                }
                else if (!isStreamVideo) {
                    value = [...segments];
                }
                this.renderPlaylist(value);
            }
            else {
                this.renderVideo();
            }
        }
        isEmptyObject(value) {
            if (!value)
                return true;
            return Object.keys(value).length === 0;
        }
        renderVideo() {
            this.playlistEl.visible = false;
            this.videoEl.visible = true;
            this.videoEl.url = this.url;
        }
        renderPlaylist(tracks) {
            this.playlistEl.visible = true;
            this.videoEl.visible = false;
            this.playList.setData({
                tracks,
                title: this.parsedData?.title || '',
                description: '',
                picture: ''
            });
        }
        onPlay(data) {
            if (!data)
                return;
            this.player.playTrack(data);
        }
        onNext() {
            const tracks = this.playList.tracks;
            const index = tracks.findIndex((track) => track.uri === this.player.track.uri);
            const newIndex = (((index + 1) % tracks.length) + tracks.length) % tracks.length;
            this.playList.activeTrack = newIndex;
            this.onPlay(tracks[newIndex]);
        }
        onPrev() {
            const tracks = this.playList.tracks;
            const index = tracks.findIndex((track) => track.uri === this.player.track.uri);
            const newIndex = (((index + -1) % tracks.length) + tracks.length) % tracks.length;
            this.playList.activeTrack = newIndex;
            this.onPlay(tracks[newIndex]);
        }
        onStateChanged() {
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
            ];
        }
        getPropertiesSchema() {
            const schema = {
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
        _getActions() {
            const propertiesSchema = this.getPropertiesSchema();
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = { url: '' };
                        return {
                            execute: () => {
                                oldData = { ...this._data };
                                if (userInputData?.url)
                                    this._data.url = userInputData.url;
                                this.renderUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            undo: () => {
                                this._data = { ...oldData };
                                this.renderUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: propertiesSchema
                }
            ];
            return actions;
        }
        getTag() {
            return this.tag;
        }
        setTag(value) {
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
        updateTag(type, value) {
            this.tag[type] = this.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
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
        resizeLayout() {
            if (this.offsetWidth <= 0)
                return;
            const tagWidth = Number(this.tag?.width);
            const hasSmallWidth = (this.offsetWidth !== 0 && this.offsetWidth < MAX_WIDTH) || window.innerWidth < MAX_WIDTH || (!isNaN(tagWidth) && tagWidth !== 0 && tagWidth < MAX_WIDTH);
            if (hasSmallWidth) {
                this.playlistEl.templateColumns = ['auto'];
                this.playlistEl.templateAreas = [['player'], ['playlist']];
                this.playerPanel.padding = { top: 0, bottom: 0, left: 0, right: 0 };
                this.player.resizeLayout(true);
            }
            else {
                this.playlistEl.templateColumns = ['repeat(2, 1fr)'];
                this.playlistEl.templateAreas = [['playlist', 'player']];
                this.playerPanel.padding = { top: '1rem', bottom: '1rem', left: '2.5rem', right: '2.5rem' };
                this.player.resizeLayout(false);
            }
        }
        refresh(skipRefreshControls) {
            super.refresh(skipRefreshControls);
            this.resizeLayout();
        }
        init() {
            super.init();
            const url = this.getAttribute('url', true);
            if (url)
                this.setData({ url });
        }
        render() {
            return (this.$render("i-hstack", { maxHeight: '100dvh', height: "100%", overflow: 'hidden', background: { color: Theme.background.main } },
                this.$render("i-video", { id: "videoEl", isStreaming: true, margin: { left: 'auto', right: 'auto' }, display: 'block', minWidth: '50%', url: "", stack: { grow: '1', shrink: '1' }, class: index_css_1.customVideoStyle, visible: false }),
                this.$render("i-grid-layout", { id: "playlistEl", position: 'relative', maxHeight: '100%', stack: { grow: '1', shrink: '1' }, templateColumns: ['repeat(2, 1fr)'], mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                templateColumns: ['auto'],
                                templateAreas: [['player'], ['playlist']]
                            }
                        }
                    ] },
                    this.$render("i-scom-media-player--playlist", { id: "playList", display: 'block', padding: { left: '1rem', right: '1rem' }, width: '100%', height: '100%', overflow: { y: 'auto' }, grid: { area: 'playlist' }, class: index_css_1.customScrollStyle, onItemClicked: this.onPlay }),
                    this.$render("i-panel", { id: "playerPanel", padding: { top: '1rem', bottom: '1rem', left: '2.5rem', right: '2.5rem' }, width: '100%', height: '100%', grid: { area: 'player' }, mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    padding: { top: 0, bottom: 0, left: 0, right: 0 },
                                    maxHeight: '0px'
                                }
                            },
                            {
                                minWidth: '768px',
                                maxWidth: '900px',
                                properties: {
                                    padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }
                                }
                            }
                        ] },
                        this.$render("i-scom-media-player--player", { id: "player", display: 'block', width: '100%', height: '100%', background: { color: Theme.background.paper }, onNext: this.onNext, onPrev: this.onPrev, onStateChanged: this.onStateChanged })))));
        }
    };
    ScomMediaPlayer = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-media-player')
    ], ScomMediaPlayer);
    exports.default = ScomMediaPlayer;
});
