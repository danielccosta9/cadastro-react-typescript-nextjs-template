export const metadata = {
  title: 'Template de Cadastro',
  description: 'Template de Cadastro',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-Br">
      <body>{children}</body>
    </html>
  )
}
