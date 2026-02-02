import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script';

export default function Layout({ children, content, lang }) {
    const router = useRouter();
    const meta = content.meta;
    const nav = content.nav;

    const toggleLang = lang === 'it' ? 'en' : 'it';
    const togglePath = lang === 'it' ? '/en' : '/';

    return (
        <div suppressHydrationWarning>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <meta name="author" content="Associazione Sillico da Scoprire" />
                <title>{meta.title}</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link rel="stylesheet" href="/css/style.css" />
                <link rel="canonical" href={`https://sillicodascoprire.it${lang === 'en' ? '/en' : ''}`} />
                <link rel="alternate" hrefLang="it" href="https://sillicodascoprire.it/" />
                <link rel="alternate" hrefLang="en" href="https://sillicodascoprire.it/en" />
                <link rel="alternate" hrefLang="x-default" href="https://sillicodascoprire.it/" />
            </Head>

            <header className="header">
                <nav className="nav container">
                    <Link href={lang === 'it' ? "/" : "/en"} className="logo">Sillico</Link>
                    <ul className="nav-menu">
                        <li><a href="#chi-siamo" className="nav-link"><i className="fa-solid fa-house-user"></i> {nav.chi_siamo}</a></li>
                        <li><a href="#sentieri" className="nav-link"><i className="fa-solid fa-mountain-sun"></i> {nav.sentieri}</a></li>
                        <li><a href="#bike-rent" className="nav-link"><i className="fa-solid fa-bicycle"></i> {nav.bike_rent}</a></li>
                        <li><a href="#eventi" className="nav-link"><i className="fa-solid fa-calendar-check"></i> {nav.eventi}</a></li>
                        <li><a href="#cosa-vedere" className="nav-link"><i className="fa-solid fa-camera-retro"></i> {nav.cosa_vedere}</a></li>
                        <li><a href="#ospitalita" className="nav-link"><i className="fa-solid fa-bed"></i> {nav.ospitalita}</a></li>
                        <li><a href="#contatti" className="nav-link"><i className="fa-solid fa-envelope"></i> {nav.contatti}</a></li>
                        <li>
                            <Link href={togglePath} className="nav-link lang-switch">
                                <i className="fa-solid fa-globe"></i> {lang === 'it' ? 'English' : 'Italiano'}
                            </Link>
                        </li>
                    </ul>
                    <div className="mobile-menu-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </nav>
            </header>

            <main>{children}</main>

            <footer className="footer">
                <div className="container">
                    <div className="social-links">
                        <a href={content.contacts.social.facebook} target="_blank" className="social-icon"><i className="fa-brands fa-facebook"></i></a>
                        <a href={content.contacts.social.instagram} target="_blank" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
                    </div>
                    <p>{content.footer.copyright}</p>
                </div>
            </footer>

            {/* Lightbox */}
            <div className="lightbox" id="lightbox">
                <span className="lightbox-close">&times;</span>
                <img src="" alt="" id="lightbox-img" />
            </div>

            <Script src="/js/main.js" strategy="afterInteractive" />
        </div>
    );
}
