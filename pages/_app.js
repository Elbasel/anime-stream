import { Navbar } from '@components/NavBar'
import { Analytics } from '@vercel/analytics/react';
import '../styles/normalize.css'
import '../styles/globals.css'
import "swiper/css";
import "swiper/css/pagination";

import { ListContextProvider } from 'context/ListContext'
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';


function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>Sharingan Stream</title>
      <meta name="viewport" content="width=device-width, minimum-scale=1" />

    </Head>
    <ListContextProvider>
      <Navbar />

      <Component {...pageProps} />
      <Toaster />
      <Analytics />
    </ListContextProvider>
  </>
}

export default MyApp
