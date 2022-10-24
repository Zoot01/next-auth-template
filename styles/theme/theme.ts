import { extendTheme, StyleFunctionProps } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        background: props.colorMode === 'light' ? '#F5F5F5' : '#ACACAC',
        minHeight: '100vh',
      },
    }),
  },
  fonts: {
    heading: 'Plus Jakarta Sans',
    body: 'Inter',
  },
  colors: {
    brand: {
      background: '#F6EFE9',
      900: '#1a202c',
    },
  },
})

export default theme
