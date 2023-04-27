'use client'
import './shared/forms/TraducoesYup';

import { BrowserRouter } from 'react-router-dom'
import { AppThemeProvider, DrawerProvider } from './shared/contexts'
import { MenuLateral } from './shared/components'
import { AppRoutes } from './routes/router'

export default function Home() {
  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
          <MenuLateral>
            <AppRoutes />
          </MenuLateral>
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  )
}
