import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root') as Element;
const root = createRoot(container);
root.render(<App/>);