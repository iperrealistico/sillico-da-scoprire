import Script from 'next/script';
import { useRouter } from 'next/router';
import '../public/css/style.css';
import { PrivacyProvider } from '../components/PrivacyProvider';

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const isAdminRoute = router.pathname.startsWith('/admin');
    const lang = router.pathname.startsWith('/en') ? 'en' : 'it';

    return (
        <>
            <Script src="/js/fontawesome.min.js" strategy="afterInteractive" />
            <PrivacyProvider enabled={!isAdminRoute} lang={lang}>
                <Component {...pageProps} />
            </PrivacyProvider>
        </>
    );
}
