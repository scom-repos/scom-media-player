import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const customRangeStyle = Styles.style({
  $nest: {
    'input[type="range"]': {
      background: Theme.divider,
      backgroundImage: 'linear-gradient(var(--track-color, var(--colors-info-main)), var(--track-color, var(--colors-info-main)))'
    }
  }
})