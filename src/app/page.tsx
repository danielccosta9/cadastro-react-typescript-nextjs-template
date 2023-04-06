'use client'
import { BrowserRouter } from "react-router-dom"
import { AppThemeProvider } from "./shared/contexts"
import AppRoutes from "./routes"

export default function Home() {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppThemeProvider>
  )
}
