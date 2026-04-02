import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { getPrivacyText } from '../lib/privacy';
import { usePrivacy } from './PrivacyProvider';

export default function Layout({ children, content, lang }) {
    const meta = content.meta;
    const nav = content.nav;
    const privacy = usePrivacy();
    const privacyText = getPrivacyText(lang);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `https://sillicodascoprire.it/${path.startsWith('/') ? path.slice(1) : path}`;
    };

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

                {/* Google Site Name */}
                <meta name="application-name" content={meta.google_site_name || 'Sillico'} />

                {/* Favicons */}
                <link rel="icon" type="image/x-icon" href={meta.favicons?.ico || "/favicon.ico"} />
                {meta.favicons?.apple && <link rel="apple-touch-icon" href={meta.favicons.apple} />}
                {meta.favicons?.android_192 && <link rel="icon" type="image/png" sizes="192x192" href={meta.favicons.android_192} />}

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://sillicodascoprire.it${lang === 'en' ? '/en' : ''}`} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:site_name" content={meta.google_site_name || 'Sillico'} />
                {meta.og_image && <meta property="og:image" content={getImageUrl(meta.og_image)} />}
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={`https://sillicodascoprire.it${lang === 'en' ? '/en' : ''}`} />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                {meta.og_image && <meta name="twitter:image" content={getImageUrl(meta.og_image)} />}
                {meta.twitter_handle && <meta name="twitter:site" content={meta.twitter_handle} />}

                <link rel="canonical" href={`https://sillicodascoprire.it${lang === 'en' ? '/en' : ''}`} />
                <link rel="alternate" hrefLang="it" href="https://sillicodascoprire.it/" />
                <link rel="alternate" hrefLang="en" href="https://sillicodascoprire.it/en" />
                <link rel="alternate" hrefLang="x-default" href="https://sillicodascoprire.it/" />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "Sillico",
                            "image": meta.og_image || "https://sillicodascoprire.it/images/sillico-hero.jpg",
                            "@id": "https://sillicodascoprire.it",
                            "url": "https://sillicodascoprire.it",
                            "telephone": "+390583662053",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Via del Moro",
                                "addressLocality": "Sillico",
                                "addressRegion": "LU",
                                "postalCode": "55036",
                                "addressCountry": "IT"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": 44.133,
                                "longitude": 10.443
                            },
                            "openingHoursSpecification": {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": [
                                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                                ],
                                "opens": "00:00",
                                "closes": "23:59"
                            }
                        })
                    }}
                />
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
                        <a href={content.contacts.social.facebook} target="_blank" rel="noreferrer noopener" className="social-icon"><i className="fa-brands fa-facebook"></i></a>
                        <a href={content.contacts.social.instagram} target="_blank" rel="noreferrer noopener" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
                    </div>
                    <div className="footer-links">
                        <Link href={privacy.policyPath} className="footer-link-button">
                            {privacyText.policyLinkLabel}
                        </Link>
                        <button type="button" className="footer-link-button" onClick={privacy.openPreferences}>
                            {privacyText.footerPreferences}
                        </button>
                    </div>
                    {content.footer?.text && (
                        <div className="footer-address" style={{ marginBottom: '1.5rem', opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {content.footer.text.split('\n').map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        </div>
                    )}
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
