import './globals.css'


export const metadata = {
  title: 'DEPO',
  description: 'Dynamic Escrow Platform Operation',
}

const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Clusters', path: '/clusters' },
  { label: 'Deposit Program', path: '/deposit' },
  { label: 'Escrow', path: '/escrow' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://tally.so/widgets/embed.js"></script>
      </head>
      <body className='bg-cream'>
        {children}
      </body>
    </html>
  )
}