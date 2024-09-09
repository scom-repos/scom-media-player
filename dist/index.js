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
define("@scom/scom-media-player/common/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.customVideoStyle = exports.trackStyle = exports.marqueeStyle = exports.customRangeStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.customRangeStyle = components_1.Styles.style({
        $nest: {
            'input[type="range"]': {
                background: Theme.divider,
                backgroundImage: 'linear-gradient(var(--track-color, var(--colors-info-main)), var(--track-color, var(--colors-info-main)))'
            }
        }
    });
    const marqueeAnim = components_1.Styles.keyframes({
        '0%': {
            transform: 'translateX(100%)'
        },
        '100%': {
            transform: 'translateX(-100%)'
        }
    });
    exports.marqueeStyle = components_1.Styles.style({
        whiteSpace: 'nowrap',
        $nest: {
            '&.marquee': {
                animation: `${marqueeAnim} 5s linear infinite`
            }
        }
    });
    exports.trackStyle = components_1.Styles.style({
        $nest: {
            'i-icon': {
                opacity: 0
            },
            'i-image': {
                opacity: 1
            },
            '&:hover': {
                $nest: {
                    'i-icon': {
                        opacity: 1
                    },
                    'i-image': {
                        opacity: 0.5
                    }
                }
            },
            '&.is-actived': {
                $nest: {
                    'i-icon': {
                        opacity: 1
                    },
                    'i-image': {
                        opacity: 0.5
                    }
                }
            }
        }
    });
    exports.customVideoStyle = components_1.Styles.style({
        $nest: {
            'i-video video': {
                aspectRatio: '16 / 9'
            }
        }
    });
});
define("@scom/scom-media-player/utils.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatTime = exports.getPath = exports.isAudio = exports.isStreaming = void 0;
    const isStreaming = (url) => {
        const ext = url.split('.').pop();
        return ext === 'm3u8' || ext === 'm3u';
    };
    exports.isStreaming = isStreaming;
    const isAudio = (url) => {
        const ext = url.split('.').pop();
        return ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
    };
    exports.isAudio = isAudio;
    const getPath = (url) => {
        return url.split('/').slice(0, -1).join('/');
    };
    exports.getPath = getPath;
    const formatTime = (time) => {
        return (0, components_2.moment)(Number(time) * 1000).format('mm:ss');
    };
    exports.formatTime = formatTime;
});
define("@scom/scom-media-player/common/playList.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-media-player/common/index.css.ts", "@scom/scom-media-player/utils.ts"], function (require, exports, components_3, index_css_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomMediaPlayerPlaylist = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomMediaPlayerPlaylist = class ScomMediaPlayerPlaylist extends components_3.Module {
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
                    const pnlTrack = (this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '0.75rem', height: '3.313rem', border: { radius: '0.5rem' }, margin: { top: '0.25rem', bottom: '0.25rem' }, padding: { left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem' }, background: { color: Theme.action.hoverBackground }, cursor: 'pointer', hover: { backgroundColor: Theme.background.main }, class: index_css_1.trackStyle, onClick: (target, event) => this.onTrackClick(target, event, track) },
                        this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.75rem', height: '100%' },
                            this.$render("i-panel", { stack: { shrink: '0' }, width: '2.5rem', height: '2.5rem' },
                                this.$render("i-image", { url: track.poster || '', width: '100%', height: '100%', display: 'inline-block', background: { color: Theme.background.modal }, objectFit: 'cover' }),
                                this.$render("i-icon", { name: 'play', width: '1rem', height: '1rem', position: 'absolute', top: '0.75rem', left: '0.75rem', opacity: 0, zIndex: 10 })),
                            this.$render("i-vstack", { gap: "0.25rem", verticalAlignment: 'center' },
                                this.$render("i-label", { caption: track.title || 'No title', font: { size: '1rem' }, wordBreak: 'break-all', lineClamp: 1 }),
                                this.$render("i-label", { caption: track.artist || 'No name', font: { size: '0.875rem', color: Theme.text.secondary }, textOverflow: 'ellipsis' }))),
                        this.$render("i-label", { caption: (0, utils_1.formatTime)(track.duration), font: { size: '0.875rem', color: Theme.text.secondary } })));
                    this.pnlPlaylist.appendChild(pnlTrack);
                }
            }
        }
        onTrackClick(target, event, track) {
            event.stopPropagation();
            if (this.currentTrackEl) {
                this.currentTrackEl.background.color = Theme.action.hoverBackground;
                const icon = this.currentTrackEl.querySelector('i-icon');
                if (icon)
                    icon.name = 'play';
                this.currentTrackEl.classList.remove('is-actived');
            }
            this.currentTrackEl = target;
            if (this.onItemClicked)
                this.onItemClicked(track);
        }
        updateActiveTrack(target) {
            if (this.currentTrackEl) {
                this.currentTrackEl.background.color = Theme.action.hoverBackground;
                const icon = this.currentTrackEl.querySelector('i-icon');
                if (icon)
                    icon.name = 'play';
                this.currentTrackEl.classList.remove('is-actived');
            }
            if (target) {
                target.background.color = Theme.action.activeBackground;
                const icon = target.querySelector('i-icon');
                if (icon)
                    icon.name = 'pause';
                this.currentTrackEl = target;
                this.currentTrackEl.classList.add('is-actived');
            }
        }
        togglePlay(value) {
            if (this.currentTrackEl) {
                this.currentTrackEl.classList.add('is-actived');
                this.currentTrackEl.background.color = value ? Theme.action.activeBackground : Theme.action.hoverBackground;
                const icon = this.currentTrackEl.querySelector('i-icon');
                if (icon)
                    icon.name = value ? 'pause' : 'play';
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
            return (this.$render("i-vstack", { width: '100%', gap: "1rem", padding: { top: '0.5rem' } },
                this.$render("i-hstack", { id: "pnlHeader", verticalAlignment: 'center', gap: "0.5rem", background: { color: Theme.background.paper }, padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' } },
                    this.$render("i-image", { id: "imgPlaylist", url: "", width: '8rem', height: 'auto', objectFit: 'cover', border: { radius: '0.25rem' }, stack: { shrink: '0' } }),
                    this.$render("i-vstack", { gap: "0.25rem" },
                        this.$render("i-label", { caption: '', font: { size: '1.25rem' }, id: 'lblTitle' }),
                        this.$render("i-label", { caption: '', font: { size: '0.875rem', color: Theme.text.secondary }, id: 'lblDesc' }))),
                this.$render("i-label", { caption: 'Tracks', font: { weight: 600, size: '1rem' } }),
                this.$render("i-vstack", { id: "pnlPlaylist", margin: { bottom: '0.75rem' } })));
        }
    };
    ScomMediaPlayerPlaylist = __decorate([
        (0, components_3.customElements)('i-scom-media-player--playlist')
    ], ScomMediaPlayerPlaylist);
    exports.ScomMediaPlayerPlaylist = ScomMediaPlayerPlaylist;
});
define("@scom/scom-media-player/common/player.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-media-player/common/index.css.ts"], function (require, exports, components_4, index_css_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomMediaPlayerPlayer = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    const DEFAULT_SKIP_TIME = 10;
    let ScomMediaPlayerPlayer = class ScomMediaPlayerPlayer extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = {
                url: '',
                type: 'playlist'
            };
            this.isRepeat = false;
            this.isShuffle = false;
            this.currentTrack = null;
            this.notUpdate = false;
            this.firstClick = false;
            this.isMute = false;
            this.timeUpdateHandler = this.timeUpdateHandler.bind(this);
            this.updateDuration = this.updateDuration.bind(this);
            this.endedHandler = this.endedHandler.bind(this);
            this.playHandler = this.playHandler.bind(this);
            this.pauseHandler = this.pauseHandler.bind(this);
            this.playingHandler = this.playingHandler.bind(this);
            this.onPlay = this.onPlay.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get url() {
            return this._data.url ?? '';
        }
        set url(value) {
            this._data.url = value ?? '';
        }
        get type() {
            return this._data.type ?? 'playlist';
        }
        set type(value) {
            this._data.type = value ?? 'playlist';
        }
        get track() {
            return this.currentTrack;
        }
        setData(data) {
            this._data = { ...data };
            this.renderUI();
        }
        renderUI() {
            this.pnlMute.visible = false;
            if (this.type === 'video') {
                this.video.visible = true;
                this.playerGrid.visible = false;
                this.video.url = this.url;
            }
            else if (this.type === 'audio') {
                this.video.visible = false;
                this.playerGrid.visible = true;
                this.playerGrid.direction = 'horizontal';
                this.playerGrid.reverse = true;
                this.pnlPrevNext.border = { style: 'none', width: 0 };
                this.pnlPrevNext.stack = { grow: '0', shrink: '1' };
                this.currentTrack = { uri: this.url, title: 'No title', artist: 'No name', poster: '' };
                this.timeLineGrid.templateAreas = [['start', 'range', 'end']];
                this.timeLineGrid.templateColumns = ['auto', '1fr', 'auto'];
                this.pnlControls.width = 'auto';
                this.pnlMute.visible = true;
            }
            else {
                this.video.visible = false;
                this.playerGrid.visible = true;
                this.playerGrid.direction = 'vertical';
                this.playerGrid.reverse = false;
                this.pnlPrevNext.border = { radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider };
                this.pnlPrevNext.stack = { grow: '1', shrink: '1' };
                this.timeLineGrid.templateAreas = [['range', 'range'], ['start', 'end']];
                this.timeLineGrid.templateColumns = ['1fr', '1fr'];
                this.pnlControls.width = '100%';
            }
            const isPlaylist = this.type === 'playlist';
            this.toggleUIs(isPlaylist);
        }
        toggleUIs(isPlaylist) {
            this.pnlPrevNext.columnsPerRow = isPlaylist ? 3 : 1;
            this.pnlNext.visible = isPlaylist;
            this.pnlPrev.visible = isPlaylist;
            this.pnlRandom.visible = isPlaylist;
            this.pnlRepeat.visible = isPlaylist;
            this.pnlInfo.visible = isPlaylist;
            this.imgTrack.visible = isPlaylist;
        }
        clear() {
            if (this.player) {
                this.player.currentTime(0);
                this.player.pause();
            }
        }
        pause() {
            if (this.player && !this.player.paused()) {
                this.notUpdate = true;
                this.player.pause();
            }
        }
        playTrack(track) {
            this.pauseOthers();
            if (!track)
                return;
            const currentSrc = this.player?.currentSrc();
            if (currentSrc && currentSrc === track.uri) {
                this.togglePlay();
            }
            else {
                this.player.pause();
                this.currentTrack = { ...track };
                const type = this.getTrackType(track.uri);
                const src = this.getTrackSrc(track.uri);
                this.player.src({ src, type });
                this.renderTrack();
                const self = this;
                this.player.ready(function () {
                    this.play().then(() => {
                        if (!self.firstClick) {
                            self.firstClick = true;
                            this.pause();
                            this.play();
                        }
                    });
                });
            }
        }
        togglePlay() {
            if (this.player.paused()) {
                this.player.play();
            }
            else {
                this.player.pause();
            }
        }
        getTrackType(url) {
            return url.endsWith('.mp3') ? 'audio/mp3' : 'application/x-mpegURL';
        }
        getTrackSrc(url) {
            return url.startsWith('//') || url.startsWith('http') ? url : this.url + '/' + url;
        }
        renderTrack() {
            const { title = 'No title', artist = 'No name', poster = '' } = this.currentTrack || {};
            this.imgTrack.url = poster;
            this.lblArtist.caption = artist;
            this.lblTrack.caption = title;
            const parentWidth = this.lblTrack?.parentElement?.offsetWidth || 0;
            if (parentWidth && parentWidth < this.lblTrack.offsetWidth) {
                this.lblTrack.classList.add('marquee');
            }
            else {
                this.lblTrack.classList.remove('marquee');
            }
        }
        updateDuration() {
            if (this.type === 'video')
                return;
            const durationValue = this.player?.duration() || this.currentTrack?.duration || 0;
            const duration = durationValue * 1000;
            this.lblEnd.caption = '00:00';
            if (duration <= 0 || !Number.isFinite(duration))
                return;
            this.pnlRange.clearInnerHTML();
            this.trackRange = this.$render("i-range", { min: 0, max: duration, value: 0, step: 1, width: '100%', height: 'auto', onClick: (target, event) => event.stopPropagation(), onChanged: () => {
                    this.player.currentTime(this.trackRange.value / 1000);
                    this.lblStart.caption = (0, components_4.moment)(this.trackRange.value).format('mm:ss');
                }, class: index_css_2.customRangeStyle });
            this.pnlRange.appendChild(this.trackRange);
            this.lblEnd.caption = (0, components_4.moment)(duration).format('mm:ss');
        }
        playNextTrack() {
            if (this.onNext)
                this.onNext();
        }
        playPrevTrack() {
            if (this.onPrev)
                this.onPrev();
        }
        playRandomTrack() {
            if (this.onRandom)
                this.onRandom();
        }
        onPlay(target, event) {
            event.stopPropagation();
            event.preventDefault();
            this.playTrack(this.currentTrack);
        }
        pauseOthers() {
            const players = document.getElementsByTagName('i-scom-media-player--player');
            const currentVideo = this.player?.el()?.querySelector('video');
            if (!currentVideo)
                return;
            for (let i = 0; i < players.length; i++) {
                const video = players[i].querySelector('video');
                if (video.id !== currentVideo.id) {
                    players[i].pause();
                }
            }
        }
        onRepeat() {
            this.isRepeat = !this.isRepeat;
            this.iconRepeat.fill = this.isRepeat ? Theme.colors.success.main : Theme.text.primary;
        }
        onShuffle() {
            this.isShuffle = !this.isShuffle;
            this.iconShuffle.fill = this.isShuffle ? Theme.colors.success.main : Theme.text.primary;
        }
        onMute() {
            this.isMute = !this.isMute;
            if (this.isMute) {
                this.player.muted(true);
                this.sliderVolume.value = 0;
            }
            else {
                this.player.muted(false);
                this.sliderVolume.value = 1;
            }
            this.iconMute.name = this.isMute ? 'volume-mute' : 'volume-up';
        }
        onVolume(target) {
            const value = target.value;
            this.player.volume(value);
            this.iconMute.name = value === 0 ? 'volume-mute' : 'volume-up';
        }
        resizeLayout(mobile) { }
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
            if (this.player)
                this.initEvents();
        }
        initEvents() {
            const self = this;
            this.player.ready(function () {
                this.on('timeupdate', self.timeUpdateHandler);
                this.on('loadeddata', self.updateDuration);
                this.on('ended', self.endedHandler);
                this.on('play', self.playHandler);
                this.on('playing', self.playingHandler);
                this.on('pause', self.pauseHandler);
            });
        }
        playHandler() {
            this.updateMetadata();
            this.addMediaSessionEvents();
        }
        playingHandler() {
            navigator.mediaSession.playbackState = 'playing';
            this.updateSessionData();
            if (this.type !== 'video') {
                this.iconPlay.name = 'pause-circle';
                if (this.onStateChanged)
                    this.onStateChanged(true);
            }
        }
        pauseHandler() {
            if (!this.notUpdate) {
                navigator.mediaSession.playbackState = 'paused';
                this.updateSessionData();
            }
            this.notUpdate = false;
            if (this.type !== 'video') {
                this.iconPlay.name = 'play-circle';
                if (this.onStateChanged)
                    this.onStateChanged(false);
            }
        }
        endedHandler() {
            this.player.currentTime(0);
            navigator.mediaSession.playbackState = 'none';
            if (this.type === 'video')
                return;
            if (this.isRepeat) {
                this.player.play();
            }
            else if (this.isShuffle) {
                this.playRandomTrack();
            }
            else {
                this.playNextTrack();
            }
        }
        timeUpdateHandler() {
            this.updateSessionData();
            if (this.type === 'video')
                return;
            const currentTime = this.player.currentTime() * 1000;
            if (this.trackRange)
                this.trackRange.value = currentTime;
            if (this.lblStart)
                this.lblStart.caption = (0, components_4.moment)(currentTime).format('mm:ss');
        }
        addMediaSessionEvents() {
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
                    mediaSession.setActionHandler('previoustrack', function () {
                        self.playPrevTrack();
                    });
                    mediaSession.setActionHandler('nexttrack', function () {
                        self.playNextTrack();
                    });
                }
                else {
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
        updateSessionData() {
            if (isNaN(this.player.duration()))
                return;
            const seekableLength = this.player.seekable().length;
            if (seekableLength === 0)
                return;
            navigator.mediaSession.setPositionState({
                duration: Math.max(this.player.seekable().end(seekableLength - 1), this.player.currentTime()),
                playbackRate: this.player.playbackRate(),
                position: this.player.currentTime()
            });
        }
        updateMetadata() {
            const { title = 'No title', artist = 'No name', poster = '' } = this.currentTrack || {};
            navigator.mediaSession.metadata = new MediaMetadata({
                title,
                artist,
                album: '',
                artwork: poster ? [{ src: poster }] : []
            });
        }
        render() {
            return (this.$render("i-vstack", { id: "playerWrapper", width: "100%", height: '100%', background: { color: Theme.background.paper } },
                this.$render("i-video", { id: "video", isStreaming: true, margin: { left: 'auto', right: 'auto' }, display: 'block', width: '100%', height: '100%', stack: { grow: '1', shrink: '1' }, class: index_css_2.customVideoStyle, visible: false }),
                this.$render("i-stack", { id: "playerGrid", direction: 'vertical', gap: "1rem", width: "100%", height: '100%', padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, alignItems: 'center' },
                    this.$render("i-image", { id: "imgTrack", width: '13rem', height: 'auto', minHeight: '6.25rem', margin: { left: 'auto', right: 'auto' }, display: 'block', background: { color: Theme.background.default } }),
                    this.$render("i-hstack", { id: "pnlInfo", horizontalAlignment: 'space-between', verticalAlignment: 'center', margin: { top: '1rem', bottom: '1rem' }, width: '100%', overflow: 'hidden', mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    margin: { top: 0, bottom: 0 }
                                }
                            }
                        ] },
                        this.$render("i-vstack", { gap: "0.25rem", verticalAlignment: 'center', maxWidth: '100%' },
                            this.$render("i-panel", { maxWidth: '100%', overflow: 'hidden' },
                                this.$render("i-label", { id: "lblTrack", caption: '', font: { weight: 600, size: 'clamp(1rem, 0.95rem + 0.25vw, 1.25rem)' }, lineHeight: '1.375rem', class: index_css_2.marqueeStyle })),
                            this.$render("i-label", { id: "lblArtist", caption: '', maxWidth: '100%', textOverflow: 'ellipsis', font: { size: 'clamp(0.75rem, 0.7rem + 0.25vw, 1rem)' } }))),
                    this.$render("i-hstack", { id: "pnlMute", visible: false, gap: "1rem", verticalAlignment: 'center' },
                        this.$render("i-icon", { name: "volume-up", width: '1.25rem', height: '1.25rem', fill: Theme.text.primary, id: "iconMute", cursor: 'pointer', stack: { shrink: '0' }, onClick: this.onMute }),
                        this.$render("i-range", { id: "sliderVolume", min: 0, max: 1, step: 0.01, value: 1, height: "auto", width: '50px', stack: { shrink: '0', grow: '0' }, onChanged: this.onVolume })),
                    this.$render("i-grid-layout", { id: "timeLineGrid", width: '100%', verticalAlignment: 'center', gap: { column: '1rem', row: '0.5rem' } },
                        this.$render("i-panel", { id: "pnlRange", stack: { 'grow': '1', 'shrink': '1' }, grid: { area: 'range' } },
                            this.$render("i-range", { min: 0, max: 1, step: 0.01, value: 0, height: "auto", enabled: false, width: '100%' })),
                        this.$render("i-label", { id: "lblStart", caption: '0:00', font: { size: '0.875rem' }, grid: { area: 'start' } }),
                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'end', grid: { area: 'end' } },
                            this.$render("i-label", { id: 'lblEnd', caption: '0:00', font: { size: '0.875rem' } }))),
                    this.$render("i-hstack", { id: "pnlControls", verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '1.25rem', mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    gap: '0.5rem'
                                }
                            }
                        ] },
                        this.$render("i-panel", { id: "pnlRandom", cursor: 'pointer', hover: { opacity: 0.5 }, onClick: () => this.onShuffle() },
                            this.$render("i-icon", { id: "iconShuffle", name: "random", width: '1rem', height: '1rem', fill: Theme.text.primary })),
                        this.$render("i-grid-layout", { verticalAlignment: "stretch", columnsPerRow: 3, id: "pnlPrevNext", height: '2.5rem', border: { radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider }, stack: { grow: '1', shrink: '1' } },
                            this.$render("i-vstack", { id: "pnlPrev", verticalAlignment: 'center', horizontalAlignment: 'center', cursor: 'pointer', hover: { opacity: 0.5 }, onClick: () => this.playPrevTrack() },
                                this.$render("i-icon", { name: "step-backward", width: '1rem', height: '1rem', fill: Theme.text.primary })),
                            this.$render("i-vstack", { verticalAlignment: 'center', horizontalAlignment: 'center', cursor: 'pointer', hover: { opacity: 0.5 }, onClick: this.onPlay },
                                this.$render("i-icon", { id: "iconPlay", name: "play-circle", width: '1.75rem', height: '1.75rem', fill: Theme.text.primary })),
                            this.$render("i-vstack", { id: "pnlNext", verticalAlignment: 'center', horizontalAlignment: 'center', cursor: 'pointer', hover: { opacity: 0.5 }, onClick: () => this.playNextTrack() },
                                this.$render("i-icon", { name: "step-forward", width: '1rem', height: '1rem', fill: Theme.text.primary }))),
                        this.$render("i-panel", { id: "pnlRepeat", cursor: 'pointer', hover: { opacity: 0.5 }, onClick: () => this.onRepeat() },
                            this.$render("i-icon", { id: "iconRepeat", name: "redo", width: '0.875rem', height: '0.875rem', fill: Theme.text.primary }))))));
        }
    };
    ScomMediaPlayerPlayer = __decorate([
        (0, components_4.customElements)('i-scom-media-player--player')
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
define("@scom/scom-media-player/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.customScrollStyle = void 0;
    exports.customScrollStyle = components_5.Styles.style({
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
define("@scom/scom-media-player", ["require", "exports", "@ijstech/components", "@scom/scom-media-player/index.css.ts", "@scom/scom-media-player/utils.ts"], function (require, exports, components_6, index_css_3, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_6.Styles.Theme.ThemeVars;
    const reqs = ['m3u8-parser'];
    const path = components_6.application.currentModuleDir;
    const MAX_WIDTH = 700;
    let ScomMediaPlayer = class ScomMediaPlayer extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this.tag = {
                light: {},
                dark: {}
            };
            this._theme = 'light';
            this._data = { url: '' };
            this.isVideo = false;
            this.parsedData = {};
            this.onPlay = this.onPlay.bind(this);
            this.onNext = this.onNext.bind(this);
            this.onPrev = this.onPrev.bind(this);
            this.onRandom = this.onRandom.bind(this);
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
            const moduleDir = this['currentModuleDir'] || path;
            return new Promise((resolve, reject) => {
                components_6.RequireJS.config({
                    baseUrl: `${moduleDir}/lib`,
                    paths: {
                        'm3u8-parser': 'm3u8-parser.min'
                    }
                });
                components_6.RequireJS.require(reqs, function (m3u8Parser) {
                    resolve(new m3u8Parser.Parser());
                });
            });
        }
        async renderUI() {
            if (!this.url || (!(0, utils_2.isStreaming)(this.url) && !(0, utils_2.isAudio)(this.url)))
                return;
            if ((0, utils_2.isAudio)(this.url)) {
                await this.renderAudio();
            }
            else {
                await this.renderStreamData();
            }
        }
        async renderStreamData() {
            if (!this.parser) {
                this.parser = await this.loadLib();
                this.parser.addParser({
                    expression: /#EXTIMG/,
                    customType: 'poster',
                    dataParser: function (line) {
                        return line.replace('#EXTIMG:', '').trim();
                    },
                    segment: true
                });
            }
            const result = await fetch(this.url);
            const manifest = await result.text();
            this.parser.push(manifest);
            this.parser.end();
            this.parsedData = this.parser.manifest;
            this.player.url = this.url;
            this.checkParsedData();
        }
        async renderAudio() {
            this.isVideo = true;
            this.playList.visible = false;
            this.playerPanel.visible = true;
            this.playlistEl.templateColumns = ['auto'];
            this.playlistEl.templateAreas = [['player'], ['player']];
            this.player.setData({
                type: 'audio',
                url: this.url
            });
        }
        checkParsedData() {
            if (!this.parsedData)
                return;
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
                    value = [...segments].map(segment => ({ ...segment, poster: segment?.custom?.poster || '' }));
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
            this.isVideo = true;
            this.playList.visible = false;
            this.playerPanel.visible = true;
            this.playlistEl.templateColumns = ['auto'];
            this.playlistEl.templateAreas = [['player'], ['player']];
            this.player.setData({
                type: 'video',
                url: this.url
            });
        }
        renderPlaylist(tracks) {
            this.isVideo = false;
            this.playList.visible = true;
            this.playerPanel.visible = false;
            this.player.setData({
                type: 'playlist',
                url: this.url
            });
            this.playList.setData({
                tracks,
                title: this.parsedData?.title || '',
                description: '',
                picture: ''
            });
        }
        onHide() {
            this.player.clear();
            // navigator.mediaSession.playbackState = 'none';
        }
        onPlay(data) {
            if (!data)
                return;
            this.player.playTrack(data);
            if (!this.playerPanel.visible) {
                this.playerPanel.visible = true;
            }
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
        onRandom() {
            const tracks = this.playList.tracks;
            const newIndex = Math.floor(Math.random() * tracks.length);
            this.playList.activeTrack = newIndex;
            this.onPlay(tracks[newIndex]);
        }
        onStateChanged(value) {
            this.playList.togglePlay(value);
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
            if (this.isVideo)
                return;
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
                this.$render("i-grid-layout", { id: "playlistEl", position: 'relative', maxHeight: '100%', stack: { grow: '1', shrink: '1' }, templateColumns: ['repeat(2, 1fr)'], gap: { column: '0px', row: '0.75rem' }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                templateColumns: ['auto'],
                                templateAreas: [['player'], ['playlist']]
                            }
                        }
                    ] },
                    this.$render("i-scom-media-player--playlist", { id: "playList", display: 'block', padding: { left: '1rem', right: '1rem' }, width: '100%', height: '100%', overflow: { y: 'auto' }, grid: { area: 'playlist' }, class: index_css_3.customScrollStyle, onItemClicked: this.onPlay }),
                    this.$render("i-panel", { id: "playerPanel", padding: { top: '1rem', bottom: '1rem', left: '2.5rem', right: '2.5rem' }, width: '100%', height: '100%', grid: { area: 'player' }, visible: false, mediaQueries: [
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
                        ] },
                        this.$render("i-scom-media-player--player", { id: "player", display: 'block', width: '100%', height: '100%', background: { color: Theme.background.paper }, onNext: this.onNext, onPrev: this.onPrev, onRandom: this.onRandom, onStateChanged: this.onStateChanged })))));
        }
    };
    ScomMediaPlayer = __decorate([
        components_6.customModule,
        (0, components_6.customElements)('i-scom-media-player')
    ], ScomMediaPlayer);
    exports.default = ScomMediaPlayer;
});
