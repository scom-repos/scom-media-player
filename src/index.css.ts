import { Styles } from "@ijstech/components";

export const aspectRatioStyle = Styles.style({
  aspectRatio: '0.58 / 1'
})

export const customVideoStyle = Styles.style({
  $nest: {
    'i-video video': {
      aspectRatio: '16 / 9'
    }
  }
})