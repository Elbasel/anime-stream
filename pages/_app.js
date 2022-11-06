import { Navbar } from '@components/NavBar'
import '../styles/normalize.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <>
    <Navbar />
    <Component {...pageProps} /></>
}

export default MyApp
