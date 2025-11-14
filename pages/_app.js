import '../styles/globals.css';
import ContextProvider from '@/context';

function getCookieString() {
  if (typeof document === 'undefined') {
    return null;
  }
  return document.cookie;
}

export default function App({ Component, pageProps }) {
  const cookies = getCookieString();
  
  return (
    <ContextProvider cookies={cookies}>
      <Component {...pageProps} />
    </ContextProvider>
  );
}

