import { useEffect } from 'react';
import { getPrivacyText } from '../lib/privacy';
import ExternalContentGate from './ExternalContentGate';

export default function GpxViewerModal({ viewerUrl, lang = 'it', onClose }) {
    const text = getPrivacyText(lang);

    useEffect(() => {
        if (!viewerUrl) return undefined;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, viewerUrl]);

    if (!viewerUrl) {
        return null;
    }

    return (
        <div className="gpx-modal active" onClick={(event) => event.target === event.currentTarget && onClose()}>
            <div className="gpx-modal-content">
                <button
                    type="button"
                    className="gpx-modal-close"
                    aria-label={text.close}
                    onClick={onClose}
                >
                    &times;
                </button>
                <ExternalContentGate
                    compact
                    title={text.gpxGateTitle}
                    description={text.gpxGateDescription}
                    actionLabel={text.gpxGateAction}
                    fallbackLink={{
                        href: viewerUrl,
                        label: text.openInNewTab,
                    }}
                >
                    <iframe
                        src={viewerUrl}
                        title={text.gpxGateTitle}
                        frameBorder="0"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                </ExternalContentGate>
            </div>
        </div>
    );
}
