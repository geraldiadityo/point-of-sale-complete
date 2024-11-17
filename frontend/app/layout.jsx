import './globals.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import TopBar from '@/components/TopBar';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'POS',
  description: 'Point of sale',
}

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const isLogin = cookieStore.has('Authorization');
  return (
    <html lang="en">
      <body>
          {isLogin && (<TopBar />)}
          <div className="container max-w-full flex">
            {isLogin && (<Nav />)}
            <div className="min-h-screen w-full">
              {children}
            </div>
          </div>
          <Footer />
      </body>
    </html>
  )
}
