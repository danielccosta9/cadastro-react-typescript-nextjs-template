'use client'
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes"

export default function Home() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
