import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: "/fabricjs-react-typescript-vite/",
    plugins: [react()],
    server: {
        open: true
    }
});
