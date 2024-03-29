import { Styles } from "@ijstech/components";

export const customScrollStyle = Styles.style({
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
})
