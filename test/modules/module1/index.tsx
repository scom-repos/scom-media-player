import { Module, customModule, Container, VStack } from '@ijstech/components';
import assets from '@modules/assets';
import ScomMediaPlayer from '@scom/scom-media-player'
@customModule
export default class Module1 extends Module {

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-scom-media-player
                // url="https://playertest.longtailvideo.com/adaptive/alt-audio-no-video/sintel/playlist.m3u8"
                // url="https://video.ijs.dev/3210752f-56a4-11ed-80cd-0242ac120003/index.m3u8"
                // url="https://live-par-2-cdn-alt.livepush.io/live/bigbuckbunnyclip/index.m3u8"
                url={assets.fullPath('img/playlist.m3u8')}
                // url="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8"
                display='block'
                width={500} height={'100dvh'}
            ></i-scom-media-player>
        </i-panel>
    }
}