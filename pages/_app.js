import { Navbar } from '@components/NavBar'
import '../styles/normalize.css'
import '../styles/globals.css'
import "swiper/css";
import "swiper/css/pagination";

import { ListContextProvider } from 'context/ListContext'
import { Toaster } from 'react-hot-toast';


function MyApp({ Component, pageProps }) {
  return <>
    <ListContextProvider>
      <Navbar />

      <Component {...pageProps} />
      <Toaster />
    </ListContextProvider>
  </>
}

export default MyApp
