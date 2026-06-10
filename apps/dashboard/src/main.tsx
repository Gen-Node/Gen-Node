import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmq8hjndc003j0claaybwbmgz"
      config={{
        loginMethods: ['email', 'wallet', 'google'],
        appearance: {
          theme: 'dark',
          accentColor: '#22d3ee',
          logo: 'https://gennode.org/logo.png',
        },
        embeddedWallets: { createOnLogin: 'users-without-wallets' },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
)
