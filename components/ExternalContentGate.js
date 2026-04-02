import { CONSENT_CATEGORIES } from '../lib/privacy';
import { usePrivacy } from './PrivacyProvider';

export default function ExternalContentGate({
    children,
    title,
    description,
    actionLabel,
    fallbackLink,
    className = '',
    compact = false,
}) {
    const { hasConsent, enableCategory, openPreferences, text, isReady } = usePrivacy();
    const canLoad = isReady && hasConsent(CONSENT_CATEGORIES.EXTERNAL_MEDIA);

    if (canLoad) {
        return children;
    }

    return (
        <div className={`privacy-gate ${compact ? 'privacy-gate--compact' : ''} ${className}`.trim()}>
            <div className="privacy-gate__panel">
                <span className="privacy-banner__eyebrow">{text.externalMediaTitle}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="privacy-gate__actions">
                    <button
                        type="button"
                        className="privacy-choice-button privacy-choice-button--primary"
                        onClick={() => enableCategory(CONSENT_CATEGORIES.EXTERNAL_MEDIA)}
                    >
                        {actionLabel}
                    </button>
                    <button
                        type="button"
                        className="privacy-choice-button privacy-choice-button--ghost"
                        onClick={openPreferences}
                    >
                        {text.manageSettings}
                    </button>
                    {fallbackLink && (
                        <a
                            href={fallbackLink.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="privacy-inline-link"
                        >
                            {fallbackLink.label}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
