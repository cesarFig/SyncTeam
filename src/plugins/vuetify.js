// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          fucisa: '#72585',
          pucha: '#B5179E',
          morado1: '#720987',
          morado2: '#560BAD',
          morado3: '#480CA8',
          azulrey: '3AOCA3',
          azul: '#3F37C9',
          azul2: '#4361EE',
          azul3: '#4895EF',
          azul4: '#4CC9FO',
        },
      },
      dark: {
        colors: {
          fucisa: '#72585',
          pucha: '#B5179E',
          morado1: '#720987',
          morado2: '#560BAD',
          morado3: '#480CA8',
          azulrey: '3AOCA3',
          azul: '#3F37C9',
          azul2: '#4361EE',
          azul3: '#4895EF',
          azul4: '#4CC9FO',
        },
      },
    },
  },
})

export default vuetify
