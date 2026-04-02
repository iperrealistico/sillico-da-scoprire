import Link from 'next/link';
import { createContext, useContext, useEffect, useState } from 'react';
import {
    CONSENT_CATEGORIES,
    DEFAULT_CONSENT_CATEGORIES,
    buildConsentRecord,
    getPrivacyPolicyPath,
    getPrivacyText,
    readStoredConsent,
    writeStoredConsent,
} from '../lib/privacy';

const PrivacyContext = createContext(null);

function CookieConsentUi({
    text,
    policyPath,
    bannerVisible,
    preferencesVisible,
    draftCategories,
    setDraftCategories,
    acceptAll,
    rejectOptional,
    savePreferences,
    openPreferences,
    closePreferences,
}) {
    return (
        <>
            {bannerVisible && (
                <div className="privacy-banner" role="dialog" aria-labelledby="privacy-banner-title" aria-live="polite">
                    <div className="privacy-banner__panel">
                        <div className="privacy-banner__copy">
                            <span className="privacy-banner__eyebrow">{text.bannerTitle}</span>
                            <h2 id="privacy-banner-title">{text.bannerTitle}</h2>
                            <p>{text.bannerBody}</p>
                        </div>
                        <div className="privacy-banner__meta">
                            <Link href={policyPath} className="privacy-inline-link">
                                {text.policyLinkLabel}
                            </Link>
                        </div>
                        <div className="privacy-banner__actions">
                            <button
                                type="button"
                                className="privacy-choice-button privacy-choice-button--ghost"
                                onClick={rejectOptional}
                            >
                                {text.rejectOptional}
                            </button>
                            <button
                                type="button"
                                className="privacy-choice-button privacy-choice-button--ghost"
                                onClick={openPreferences}
                            >
                                {text.customize}
                            </button>
                            <button
                                type="button"
                                className="privacy-choice-button privacy-choice-button--primary"
                                onClick={acceptAll}
                            >
                                {text.acceptAll}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {preferencesVisible && (
                <div className="privacy-modal-backdrop" onClick={closePreferences}>
                    <div
                        className="privacy-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="privacy-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="privacy-modal__header">
                            <div>
                                <span className="privacy-banner__eyebrow">{text.bannerTitle}</span>
                                <h2 id="privacy-modal-title">{text.modalTitle}</h2>
                                <p>{text.modalDescription}</p>
                            </div>
                            <button
                                type="button"
                                className="privacy-modal__close"
                                aria-label={text.close}
                                onClick={closePreferences}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="privacy-modal__body">
                            <div className="privacy-toggle-card">
                                <div>
                                    <h3>{text.necessaryTitle}</h3>
                                    <p>{text.necessaryDescription}</p>
                                </div>
                                <div className="privacy-toggle-card__badge">{text.alwaysActive}</div>
                            </div>

                            <label
                                className="privacy-toggle-card privacy-toggle-card--interactive"
                                htmlFor="privacy-external-media"
                            >
                                <div>
                                    <h3>{text.externalMediaTitle}</h3>
                                    <p>{text.externalMediaDescription}</p>
                                </div>
                                <span className="privacy-switch">
                                    <input
                                        id="privacy-external-media"
                                        type="checkbox"
                                        checked={draftCategories[CONSENT_CATEGORIES.EXTERNAL_MEDIA]}
                                        onChange={(event) =>
                                            setDraftCategories((current) => ({
                                                ...current,
                                                [CONSENT_CATEGORIES.EXTERNAL_MEDIA]: event.target.checked,
                                            }))
                                        }
                                    />
                                    <span className="privacy-switch__track" />
                                </span>
                            </label>
                        </div>

                        <div className="privacy-modal__footer">
                            <Link href={policyPath} className="privacy-inline-link">
                                {text.policyLinkLabel}
                            </Link>
                            <div className="privacy-modal__actions">
                                <button
                                    type="button"
                                    className="privacy-choice-button privacy-choice-button--ghost"
                                    onClick={rejectOptional}
                                >
                                    {text.rejectOptional}
                                </button>
                                <button
                                    type="button"
                                    className="privacy-choice-button privacy-choice-button--ghost"
                                    onClick={() => savePreferences(draftCategories)}
                                >
                                    {text.savePreferences}
                                </button>
                                <button
                                    type="button"
                                    className="privacy-choice-button privacy-choice-button--primary"
                                    onClick={acceptAll}
                                >
                                    {text.acceptAll}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export function PrivacyProvider({ children, lang = 'it', enabled = true }) {
    const text = getPrivacyText(lang);
    const policyPath = getPrivacyPolicyPath(lang);
    const [isReady, setIsReady] = useState(!enabled);
    const [bannerVisible, setBannerVisible] = useState(false);
    const [preferencesVisible, setPreferencesVisible] = useState(false);
    const [consent, setConsent] = useState(buildConsentRecord(DEFAULT_CONSENT_CATEGORIES));
    const [draftCategories, setDraftCategories] = useState(DEFAULT_CONSENT_CATEGORIES);

    useEffect(() => {
        if (!enabled) {
            setIsReady(true);
            setBannerVisible(false);
            setPreferencesVisible(false);
            return;
        }

        const storedConsent = readStoredConsent();

        if (storedConsent) {
            setConsent(storedConsent);
            setDraftCategories(storedConsent.categories);
            setBannerVisible(false);
        } else {
            const defaults = buildConsentRecord(DEFAULT_CONSENT_CATEGORIES);
            setConsent(defaults);
            setDraftCategories(defaults.categories);
            setBannerVisible(true);
        }

        setIsReady(true);
    }, [enabled]);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return undefined;

        const handleOpenPrivacySettings = () => setPreferencesVisible(true);
        window.addEventListener('sillico:open-privacy-settings', handleOpenPrivacySettings);

        return () => {
            window.removeEventListener('sillico:open-privacy-settings', handleOpenPrivacySettings);
        };
    }, [enabled]);

    useEffect(() => {
        if (!preferencesVisible) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setPreferencesVisible(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [preferencesVisible]);

    useEffect(() => {
        setDraftCategories(consent.categories);
    }, [consent]);

    const applyConsent = (nextCategories) => {
        const nextConsent = buildConsentRecord(nextCategories);
        writeStoredConsent(nextConsent);
        setConsent(nextConsent);
        setDraftCategories(nextConsent.categories);
        setBannerVisible(false);
        setPreferencesVisible(false);

        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('sillico:privacy-updated', {
                    detail: nextConsent,
                })
            );
        }
    };

    const acceptAll = () =>
        applyConsent({
            [CONSENT_CATEGORIES.EXTERNAL_MEDIA]: true,
        });

    const rejectOptional = () =>
        applyConsent({
            [CONSENT_CATEGORIES.EXTERNAL_MEDIA]: false,
        });

    const savePreferences = (nextCategories) =>
        applyConsent({
            [CONSENT_CATEGORIES.EXTERNAL_MEDIA]: Boolean(
                nextCategories[CONSENT_CATEGORIES.EXTERNAL_MEDIA]
            ),
        });

    const openPreferences = () => setPreferencesVisible(true);
    const closePreferences = () => setPreferencesVisible(false);

    const enableCategory = (category) => {
        if (category !== CONSENT_CATEGORIES.EXTERNAL_MEDIA) {
            return;
        }

        applyConsent({
            ...consent.categories,
            [CONSENT_CATEGORIES.EXTERNAL_MEDIA]: true,
        });
    };

    const contextValue = {
        enabled,
        lang,
        text,
        policyPath,
        isReady,
        consent,
        hasConsent: (category) =>
            Boolean(isReady && consent.categories && consent.categories[category]),
        acceptAll,
        rejectOptional,
        savePreferences,
        openPreferences,
        closePreferences,
        enableCategory,
        showBanner: () => setBannerVisible(true),
    };

    return (
        <PrivacyContext.Provider value={contextValue}>
            {children}

            {enabled && isReady && (
                <>
                    <CookieConsentUi
                        text={text}
                        policyPath={policyPath}
                        bannerVisible={bannerVisible}
                        preferencesVisible={preferencesVisible}
                        draftCategories={draftCategories}
                        setDraftCategories={setDraftCategories}
                        acceptAll={acceptAll}
                        rejectOptional={rejectOptional}
                        savePreferences={savePreferences}
                        openPreferences={openPreferences}
                        closePreferences={closePreferences}
                    />

                    {!bannerVisible && (
                        <button
                            type="button"
                            className="privacy-floating-button"
                            onClick={openPreferences}
                        >
                            {text.floatingLabel}
                        </button>
                    )}
                </>
            )}
        </PrivacyContext.Provider>
    );
}

export function usePrivacy() {
    const context = useContext(PrivacyContext);

    if (context) {
        return context;
    }

    return {
        enabled: false,
        lang: 'it',
        text: getPrivacyText('it'),
        policyPath: getPrivacyPolicyPath('it'),
        isReady: true,
        consent: buildConsentRecord(DEFAULT_CONSENT_CATEGORIES),
        hasConsent: () => false,
        acceptAll: () => {},
        rejectOptional: () => {},
        savePreferences: () => {},
        openPreferences: () => {},
        closePreferences: () => {},
        enableCategory: () => {},
        showBanner: () => {},
    };
}
