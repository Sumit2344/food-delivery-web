import '../src/index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const metadata = {
  title: 'Tomato - Online Food Ordering App',
  description: 'Discover nearby restaurants and order your favorite food.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <div id="modal" />
      </body>
    </html>
  )
}
