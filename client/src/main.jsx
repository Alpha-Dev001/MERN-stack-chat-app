import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { ChatContextProvider } from './context/ChatContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </ErrorBoundary>,
)
