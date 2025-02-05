import { Module, customModule, Container } from '@ijstech/components';
import assets from '@modules/assets';
import ScomMediaPlayer from '@scom/scom-media-player';
import ScomWidgetTest from '@scom/scom-widget-test';

@customModule
export default class Module1 extends Module {
    private mediaPlayer: ScomMediaPlayer;
    private widgetModule: ScomWidgetTest;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    private async onShowConfig() {
        const editor = this.mediaPlayer.getConfigurators().find(v => v.target === 'Editor');
        const widgetData = await editor.getData();
        if (!this.widgetModule) {
            this.widgetModule = await ScomWidgetTest.create({
                widgetName: 'scom-media-player',
                onConfirm: (data: any, tag: any) => {
                    editor.setData(data);
                    editor.setTag(tag);
                    this.widgetModule.closeModal();
                }
            });
        }
        this.widgetModule.openModal({
            width: '90%',
            maxWidth: '90rem',
            minHeight: 400,
            padding: { top: 0, bottom: 0, left: 0, right: 0 },
            closeOnBackdropClick: true,
            closeIcon: null
        });
        this.widgetModule.show(widgetData);
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel width="100%">
            <i-vstack
                verticalAlignment="center"
                margin={{ top: '1rem', left: 'auto', right: 'auto' }}
                padding={{ left: '1rem', right: '1rem' }}
                gap="1rem"
                width="100%"
            >
                <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
                <i-scom-media-player
                    id="mediaPlayer"
                    url="https://video.ijs.dev/3210752f-56a4-11ed-80cd-0242ac120003/index.m3u8"
                    // url="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8"
                    display='block'
                    width={'100%'}
                ></i-scom-media-player>
                <i-scom-media-player
                    url={assets.fullPath('img/playlist.m3u8')}
                    display='block'
                    width={'100%'}
                ></i-scom-media-player>
                <i-scom-media-player
                    url={'https://cdn1.suno.ai/850c09e6-0393-4476-a5b7-3a31a24d5641.mp3'}
                    display='block'
                    width={'100%'}
                ></i-scom-media-player>
            </i-vstack>
        </i-panel>
    }
}