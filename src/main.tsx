import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { getTheme, setTheme } from './utils/storage'

const theme = getTheme()
setTheme(theme)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
