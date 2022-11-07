import { Navbar } from '@components/NavBar'
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
      <title>Sharingal Stream</title>
    </Head>
    <ListContextProvider>
      <Navbar />

      <Component {...pageProps} />
      <Toaster />
    </ListContextProvider>
  </>
}

export default MyApp
