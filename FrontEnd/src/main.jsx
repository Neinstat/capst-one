import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Force light theme
localStorage.setItem("spark-theme", "light");
document.documentElement.setAttribute("data-theme", "light");
document.documentElement.classList.remove("dark");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
