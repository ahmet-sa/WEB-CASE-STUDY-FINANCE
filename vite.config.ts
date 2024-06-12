import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import unocss from 'unocss/vite';

export default defineConfig({
  plugins: [
    react(),
    unocss({
      theme: {
    
          colors: {
            primary: {
              DEFAULT: '#4CAF50',
              light: '#A5D6A7',
            },
            secondary: {
              DEFAULT: '#FF9800',
              light: '#FFCC80',
            },
            backgraound:'#f5f5f5 ',
       
          },
      
      },
    }),
  ],
});
