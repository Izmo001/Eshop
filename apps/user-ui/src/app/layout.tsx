import Header from '../shared/widgets';
import {Poppins, Roboto} from "next/font/google";
import './global.css';
export const metadata = {
  title: 'Eshop',
  description: 'welcomm eto E-shop',
}
const roboto = Roboto({
  subsets: ['latin'],
  weight: ["300",'400', '500', '600', '700', '800', '900'],
  variable: '--font-roboto',
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ["100",'200', "300", '400','500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='{roboto.variable} ${poppins.variable} '>
        <Header />
        {children}
      </body>
    </html>
  )
}
