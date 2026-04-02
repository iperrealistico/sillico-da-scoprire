import Head from 'next/head';
import Link from 'next/link';
import { getLangContent } from '../lib/content';
import {
    CONSENT_MAX_AGE_DAYS,
    DEFAULT_CONSENT_CATEGORIES,
    PRIVACY_SERVICES,
    getPrivacyPolicyPath,
    getPrivacyText,
} from '../lib/privacy';
import { usePrivacy } from '../components/PrivacyProvider';

function PrivacyCookiePage({ lang = 'it' }) {
    const content = getLangContent(lang);
    const text = getPrivacyText(lang);
    const { openPreferences } = usePrivacy();
    const homePath = lang === 'en' ? '/en' : '/';
    const alternatePath = lang === 'en' ? '/privacy-cookie' : '/en/privacy-cookie';
    const durationText = `${CONSENT_MAX_AGE_DAYS} ${lang === 'en' ? 'days' : 'giorni'}`;

    return (
        <div className="privacy-page">
            <Head>
                <title>{text.policyTitle} - Sillico</title>
                <meta
                    name="description"
                    content={
                        lang === 'en'
                            ? 'Privacy and cookie information for the Sillico website.'
                            : 'Informativa privacy e cookie del sito Sillico.'
                    }
                />
            </Head>

            <header className="privacy-page__header">
                <div className="container privacy-page__header-inner">
                    <Link href={homePath} className="logo">
                        Sillico
                    </Link>
                    <div className="privacy-page__header-actions">
                        <Link href={homePath} className="privacy-inline-link">
                            {text.policyBackHome}
                        </Link>
                        <Link href={alternatePath} className="privacy-inline-link">
                            {text.policyLanguageSwitch}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="privacy-page__main">
                <div className="container privacy-page__content">
                    <section className="privacy-policy-card">
                        <span className="privacy-banner__eyebrow">{text.policyUpdateLabel}</span>
                        <h1>{text.policyTitle}</h1>
                        <p>{text.policyIntro}</p>
                        <div className="privacy-policy-card__meta">
                            <span>
                                {text.policyUpdateLabel}: <strong>{text.policyUpdatedAt}</strong>
                            </span>
                            <button
                                type="button"
                                className="privacy-choice-button privacy-choice-button--ghost"
                                onClick={openPreferences}
                            >
                                {text.manageFromPage}
                            </button>
                        </div>
                    </section>

                    <section className="privacy-policy-card">
                        <h2>{text.policyControllerTitle}</h2>
                        <div className="privacy-policy-address">
                            {content.footer.text.split('\n').map((line, index) => (
                                <div key={index}>{line}</div>
                            ))}
                        </div>
                    </section>

                    <section className="privacy-policy-card">
                        <h2>{text.policyHowSiteWorksTitle}</h2>
                        <ul className="privacy-policy-list">
                            {text.policyHowSiteWorksItems.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="privacy-policy-card">
                        <h2>{text.policyNoConsentTitle}</h2>
                        <ul className="privacy-policy-list">
                            {text.policyNoConsentItems.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="privacy-policy-card">
                        <h2>{text.policyCategoriesTitle}</h2>
                        <div className="privacy-table-wrapper">
                            <table className="privacy-table">
                                <thead>
                                    <tr>
                                        <th>{text.policyCategoryLabel}</th>
                                        <th>{text.policyPurposeLabel}</th>
                                        <th>{text.policyDefaultLabel}</th>
                                        <th>{text.policyDurationLabel}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{text.necessaryTitle}</td>
                                        <td>{text.necessaryDescription}</td>
                                        <td>{text.alwaysActive}</td>
                                        <td>{durationText}</td>
                                    </tr>
                                    <tr>
                                        <td>{text.externalMediaTitle}</td>
                                        <td>{text.externalMediaDescription}</td>
                                        <td>
                                            {DEFAULT_CONSENT_CATEGORIES.externalMedia
                                                ? text.active
                                                : text.inactive}
                                        </td>
                                        <td>{durationText}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="privacy-policy-card">
                        <h2>{text.policyServicesTitle}</h2>
                        <div className="privacy-table-wrapper">
                            <table className="privacy-table">
                                <thead>
                                    <tr>
                                        <th>{text.policyServiceLabel}</th>
                                        <th>{text.policyProviderLabel}</th>
                                        <th>{text.policyActivationLabel}</th>
                                        <th>{text.policyDomainsLabel}</th>
                                        <th>{text.policyPolicyLabel}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PRIVACY_SERVICES.map((service) => (
                                        <tr key={service.id}>
                                            <td>
                                                <strong>{service.name[lang]}</strong>
                                                <div>{service.purpose[lang]}</div>
                                            </td>
                                            <td>{service.provider[lang]}</td>
                                            <td>{service.activation[lang]}</td>
                                            <td>{service.domains.join(', ')}</td>
                                            <td>
                                                <a
                                                    href={service.policyUrl}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="privacy-inline-link"
                                                >
                                                    {text.openExternal}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="privacy-policy-card">
                        <h2>{text.policyPreferencesTitle}</h2>
                        <p>{text.policyPreferencesBody}</p>
                    </section>

                    <section className="privacy-policy-card">
                        <h2>{text.policyRightsTitle}</h2>
                        <p>{text.policyRightsBody}</p>
                        <p>
                            <a href="mailto:polissillico@gmail.com" className="privacy-inline-link">
                                polissillico@gmail.com
                            </a>{' '}
                            |{' '}
                            <a href="mailto:polis.sillico@pec.it" className="privacy-inline-link">
                                polis.sillico@pec.it
                            </a>
                        </p>
                    </section>

                    <section className="privacy-policy-card privacy-policy-card--footer">
                        <Link href={homePath} className="privacy-inline-link">
                            {text.policyBackHome}
                        </Link>
                        <Link href={getPrivacyPolicyPath(lang)} className="privacy-inline-link">
                            {text.policyLinkLabel}
                        </Link>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default PrivacyCookiePage;

export async function getStaticProps() {
    return {
        props: {
            lang: 'it',
        },
    };
}
