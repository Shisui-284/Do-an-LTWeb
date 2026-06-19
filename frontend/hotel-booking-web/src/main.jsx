import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

// Gắn sẵn "chìa khóa" vào mọi yêu cầu axios gửi đi
axios.defaults.auth = {
  username: '11316812',
  password: '60-dayfreetrial'
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
