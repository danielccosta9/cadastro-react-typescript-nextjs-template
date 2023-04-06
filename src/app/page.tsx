'use client'
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@mui/material"
import { LightTheme } from "./shared/themes"
import AppRoutes from "./routes"

export default function Home() {
  return (
    <ThemeProvider theme={LightTheme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}
