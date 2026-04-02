export const CONSENT_VERSION = '2026-04-02';
export const CONSENT_COOKIE_NAME = 'sillico_privacy_consent';
export const CONSENT_MAX_AGE_DAYS = 180;

export const CONSENT_CATEGORIES = {
    NECESSARY: 'necessary',
    EXTERNAL_MEDIA: 'externalMedia',
};

export const DEFAULT_CONSENT_CATEGORIES = {
    [CONSENT_CATEGORIES.NECESSARY]: true,
    [CONSENT_CATEGORIES.EXTERNAL_MEDIA]: false,
};

export const PRIVACY_SERVICES = [
    {
        id: 'google-maps-embed',
        category: CONSENT_CATEGORIES.EXTERNAL_MEDIA,
        name: {
            it: 'Google Maps Embed',
            en: 'Google Maps Embed',
        },
        provider: {
            it: 'Google LLC',
            en: 'Google LLC',
        },
        purpose: {
            it: 'Visualizzazione della mappa incorporata nella sezione Contatti, con relative risorse tecniche di Google.',
            en: 'Display of the embedded map in the Contacts section, including related Google technical resources.',
        },
        activation: {
            it: 'Solo se l’utente abilita i contenuti esterni e sceglie di mostrare la mappa.',
            en: 'Only if the user enables external content and chooses to display the map.',
        },
        domains: ['www.google.com', 'maps.googleapis.com', 'maps.gstatic.com', 'fonts.googleapis.com'],
        policyUrl: 'https://policies.google.com/privacy',
    },
    {
        id: 'gpx-viewer',
        category: CONSENT_CATEGORIES.EXTERNAL_MEDIA,
        name: {
            it: 'Visualizzatore GPX esterno',
            en: 'External GPX viewer',
        },
        provider: {
            it: 'GitHub Pages / iperrealistico.github.io',
            en: 'GitHub Pages / iperrealistico.github.io',
        },
        purpose: {
            it: 'Apertura della mappa interattiva dei sentieri in un servizio esterno integrato nel sito.',
            en: 'Opening the interactive trail map inside an external service embedded in the site.',
        },
        activation: {
            it: 'Solo se l’utente abilita i contenuti esterni e apre una mappa sentiero.',
            en: 'Only if the user enables external content and opens a trail map.',
        },
        domains: ['iperrealistico.github.io'],
        policyUrl: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
    },
];

export const PRIVACY_TEXT = {
    it: {
        bannerTitle: 'Privacy e cookie',
        bannerBody:
            'Usiamo solo strumenti tecnici per far funzionare il sito e ricordare le tue preferenze. Google Maps e il visualizzatore esterno dei sentieri vengono caricati solo se abiliti i contenuti esterni.',
        acceptAll: 'Accetta tutto',
        rejectOptional: 'Rifiuta non necessari',
        customize: 'Personalizza',
        savePreferences: 'Salva preferenze',
        manageSettings: 'Impostazioni privacy',
        close: 'Chiudi',
        floatingLabel: 'Privacy',
        policyLinkLabel: 'Privacy & Cookie Policy',
        modalTitle: 'Preferenze privacy',
        modalDescription:
            'Per impostazione predefinita restano attivi solo gli strumenti strettamente necessari. Puoi modificare le tue scelte in qualsiasi momento.',
        alwaysActive: 'Sempre attivi',
        active: 'Attivo',
        inactive: 'Disattivo',
        necessaryTitle: 'Tecnici strettamente necessari',
        necessaryDescription:
            'Servono a mostrare il sito, mantenere la sicurezza di base e ricordare la tua scelta privacy.',
        externalMediaTitle: 'Contenuti esterni',
        externalMediaDescription:
            'Permette di caricare Google Maps e il visualizzatore GPX esterno. Questi servizi possono ricevere dati tecnici come IP, user agent e impostare propri cookie o strumenti simili.',
        mapGateTitle: 'Mappa esterna disattivata',
        mapGateDescription:
            'Per mostrarti la mappa incorporata usiamo un servizio di Google. Verrà caricato solo dopo il tuo consenso ai contenuti esterni.',
        mapGateAction: 'Consenti e mostra la mappa',
        gpxGateTitle: 'Mappa sentiero esterna disattivata',
        gpxGateDescription:
            'La mappa interattiva del sentiero è fornita da un servizio esterno e viene caricata solo dopo il tuo consenso.',
        gpxGateAction: 'Consenti e apri la mappa',
        openExternal: 'Apri sul sito esterno',
        openInGoogleMaps: 'Apri in Google Maps',
        openInNewTab: 'Apri in una nuova scheda',
        footerPreferences: 'Modifica consenso',
        policyTitle: 'Privacy & Cookie Policy',
        policyIntro:
            'Questa pagina spiega come il sito gestisce cookie, contenuti esterni e preferenze privacy. Il sito pubblico funziona senza cookie di profilazione e senza analytics: per default vengono attivati solo strumenti strettamente necessari.',
        policyBackHome: 'Torna al sito',
        policyLanguageSwitch: 'English version',
        policyControllerTitle: 'Titolare del trattamento',
        policyHowSiteWorksTitle: 'Come funziona il sito',
        policyHowSiteWorksItems: [
            'Le pagine pubbliche sono prevalentemente statiche e mostrano contenuti informativi sul borgo, i sentieri, l’ospitalità e i contatti.',
            'Le immagini del sito e i file GPX sono serviti come contenuti del sito; non attivano banner dedicati perché non sono usati per finalità di profilazione.',
            'L’area amministrativa è separata dal sito pubblico e usa storage locale del browser solo per la sessione di accesso degli operatori.',
            'Google Maps e il visualizzatore esterno delle mappe GPX non vengono caricati prima del consenso.',
        ],
        policyNoConsentTitle: 'Cosa non richiede consenso preventivo',
        policyNoConsentItems: [
            'Il cookie tecnico che registra la tua scelta privacy.',
            'Le risorse locali del sito necessarie a impaginazione, navigazione, accessibilità e sicurezza di base.',
            'I semplici link esterni verso social network o siti partner: il relativo trattamento avviene solo se decidi di aprirli.',
        ],
        policyCategoriesTitle: 'Categorie gestite dal pannello',
        policyCategoryLabel: 'Categoria',
        policyPurposeLabel: 'Finalità',
        policyDefaultLabel: 'Default',
        policyDurationLabel: 'Durata',
        policyServicesTitle: 'Servizi terzi soggetti a consenso',
        policyServiceLabel: 'Servizio',
        policyProviderLabel: 'Fornitore',
        policyActivationLabel: 'Quando si attiva',
        policyDomainsLabel: 'Domini',
        policyPolicyLabel: 'Informativa',
        policyPreferencesTitle: 'Gestione preferenze',
        policyPreferencesBody:
            'Puoi modificare o revocare il consenso in qualsiasi momento dal pulsante “Privacy” sempre visibile sul sito o dal link nel footer. In linea con le linee guida italiane, il banner viene riproposto dopo sei mesi, in caso di modifiche rilevanti o se il browser perde la registrazione della scelta.',
        policyRightsTitle: 'Diritti e contatti',
        policyRightsBody:
            'Per richieste relative ai dati personali o per esercitare i diritti previsti dal GDPR puoi contattare Associazione Culturale Polis Sillico APS ai recapiti indicati qui sotto.',
        policyUpdateLabel: 'Ultimo aggiornamento',
        policyUpdatedAt: '2 aprile 2026',
        manageFromPage: 'Apri impostazioni privacy',
    },
    en: {
        bannerTitle: 'Privacy and cookies',
        bannerBody:
            'We only use technical tools needed to run the site and remember your choices. Google Maps and the external trail viewer are loaded only if you enable external content.',
        acceptAll: 'Accept all',
        rejectOptional: 'Reject non-essential',
        customize: 'Customize',
        savePreferences: 'Save preferences',
        manageSettings: 'Privacy settings',
        close: 'Close',
        floatingLabel: 'Privacy',
        policyLinkLabel: 'Privacy & Cookie Policy',
        modalTitle: 'Privacy preferences',
        modalDescription:
            'Only strictly necessary tools stay enabled by default. You can change your choices at any time.',
        alwaysActive: 'Always active',
        active: 'Active',
        inactive: 'Inactive',
        necessaryTitle: 'Strictly necessary',
        necessaryDescription:
            'Needed to display the site, maintain basic security and remember your privacy choice.',
        externalMediaTitle: 'External content',
        externalMediaDescription:
            'Allows Google Maps and the external GPX viewer to load. These services may receive technical data such as IP address, user agent and set their own cookies or similar tools.',
        mapGateTitle: 'External map disabled',
        mapGateDescription:
            'We use a Google service to display the embedded map. It will load only after you consent to external content.',
        mapGateAction: 'Allow and show the map',
        gpxGateTitle: 'External trail map disabled',
        gpxGateDescription:
            'The interactive trail map is provided by an external service and is loaded only after your consent.',
        gpxGateAction: 'Allow and open the map',
        openExternal: 'Open on external site',
        openInGoogleMaps: 'Open in Google Maps',
        openInNewTab: 'Open in a new tab',
        footerPreferences: 'Update consent',
        policyTitle: 'Privacy & Cookie Policy',
        policyIntro:
            'This page explains how the site handles cookies, external content and privacy preferences. The public site runs without profiling cookies and without analytics: by default, only strictly necessary tools are enabled.',
        policyBackHome: 'Back to website',
        policyLanguageSwitch: 'Versione italiana',
        policyControllerTitle: 'Data controller',
        policyHowSiteWorksTitle: 'How the site works',
        policyHowSiteWorksItems: [
            'Public pages are mostly static and present information about the village, trails, hospitality and contacts.',
            'Site images and GPX files are served as site content; they do not trigger dedicated consent because they are not used for profiling purposes.',
            'The admin area is separate from the public site and uses browser local storage only for operator login sessions.',
            'Google Maps and the external GPX map viewer are not loaded before consent.',
        ],
        policyNoConsentTitle: 'What does not require prior consent',
        policyNoConsentItems: [
            'The technical cookie that stores your privacy choice.',
            'Local site resources needed for layout, navigation, accessibility and basic security.',
            'Simple outbound links to social networks or partner websites: related processing starts only if you decide to open them.',
        ],
        policyCategoriesTitle: 'Categories handled by the panel',
        policyCategoryLabel: 'Category',
        policyPurposeLabel: 'Purpose',
        policyDefaultLabel: 'Default',
        policyDurationLabel: 'Duration',
        policyServicesTitle: 'Third-party services subject to consent',
        policyServiceLabel: 'Service',
        policyProviderLabel: 'Provider',
        policyActivationLabel: 'When it activates',
        policyDomainsLabel: 'Domains',
        policyPolicyLabel: 'Policy',
        policyPreferencesTitle: 'Preference management',
        policyPreferencesBody:
            'You can modify or withdraw consent at any time from the always-visible “Privacy” button or from the footer link. In line with Italian guidance, the banner is shown again after six months, after material changes or if the browser loses the record of your choice.',
        policyRightsTitle: 'Rights and contacts',
        policyRightsBody:
            'For personal data requests or to exercise GDPR rights, you can contact Associazione Culturale Polis Sillico APS using the details below.',
        policyUpdateLabel: 'Last updated',
        policyUpdatedAt: '2 April 2026',
        manageFromPage: 'Open privacy settings',
    },
};

export function getPrivacyText(lang = 'it') {
    return PRIVACY_TEXT[lang] || PRIVACY_TEXT.it;
}

export function getPrivacyPolicyPath(lang = 'it') {
    return lang === 'en' ? '/en/privacy-cookie' : '/privacy-cookie';
}

export function buildConsentRecord(partialCategories = {}, updatedAt = new Date().toISOString()) {
    return {
        version: CONSENT_VERSION,
        updatedAt,
        categories: {
            ...DEFAULT_CONSENT_CATEGORIES,
            ...partialCategories,
            [CONSENT_CATEGORIES.NECESSARY]: true,
        },
    };
}

function parseConsentValue(value) {
    if (!value) return null;

    try {
        const parsed = JSON.parse(value);

        if (!parsed || typeof parsed !== 'object' || parsed.version !== CONSENT_VERSION) {
            return null;
        }

        const updatedAt = new Date(parsed.updatedAt);
        if (Number.isNaN(updatedAt.getTime())) {
            return null;
        }

        const ageInMs = Date.now() - updatedAt.getTime();
        if (ageInMs > CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000) {
            return null;
        }

        return buildConsentRecord(
            {
                [CONSENT_CATEGORIES.EXTERNAL_MEDIA]: Boolean(
                    parsed.categories && parsed.categories[CONSENT_CATEGORIES.EXTERNAL_MEDIA]
                ),
            },
            updatedAt.toISOString()
        );
    } catch (error) {
        return null;
    }
}

function readConsentCookie() {
    if (typeof document === 'undefined') return null;

    const cookie = document.cookie
        .split('; ')
        .find((item) => item.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (!cookie) return null;

    return parseConsentValue(decodeURIComponent(cookie.slice(CONSENT_COOKIE_NAME.length + 1)));
}

export function readStoredConsent() {
    return readConsentCookie();
}

export function writeStoredConsent(consent) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const serialized = JSON.stringify(consent);

    const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
        serialized
    )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}
