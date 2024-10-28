import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost-cert.pem')),
    },
    host: 'localhost',
    port: 5173,
    proxy: {
      '/3D_printer/Files/img': {
        target: 'http://192.168.116.229',
        changeOrigin: true,
      },
      '/3D_printer/Files/img/jobs': {
        target: 'http://192.168.116.229',
        changeOrigin: true,
      },
      '/3D_printer/3d_project': {
        target: 'http://192.168.116.229',
        changeOrigin: true,
      },
      '/3D_printer/Files/3d_files': { 
        target: 'http://192.168.116.229',
        changeOrigin: true,
      }
    }
    
  }
})
