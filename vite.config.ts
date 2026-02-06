import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: "/fabricjs7-react-typescript-vite/",
    plugins: [react()],
    server: {
        open: true
    }
});
