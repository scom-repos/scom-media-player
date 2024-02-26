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

const marqueeAnim = Styles.keyframes({
  '0%': {
    transform: 'translateX(100%)'
  },
  '100%': {
    transform: 'translateX(-100%)'
  }
});

export const marqueeStyle = Styles.style({
  whiteSpace: 'nowrap',
  $nest: {
    '&.marquee': {
      animation: `${marqueeAnim} 5s linear infinite`
    }
  }
})

export const trackStyle = Styles.style({
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
})
