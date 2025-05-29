import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import MainLayout from '../components/layout/MainLayout';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => (
    <MainLayout>
      {page}
    </MainLayout>
  ));

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}

export default MyApp;
