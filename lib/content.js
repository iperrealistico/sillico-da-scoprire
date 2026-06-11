import siteContent from '../content/site.json';

function hasOwnLocaleValue(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export function resolveLocalizedText(value, lang = 'it', fallback = '') {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed || fallback;
    }

    if (typeof value !== 'object' || value === null) {
        return fallback;
    }

    const localized = typeof value[lang] === 'string' ? value[lang].trim() : '';
    const italian = typeof value.it === 'string' ? value.it.trim() : '';
    const english = typeof value.en === 'string' ? value.en.trim() : '';

    return localized || italian || english || fallback;
}

export function normalizeEventBooking(booking) {
    if (typeof booking !== 'object' || booking === null) {
        return undefined;
    }

    const url = typeof booking.url === 'string' ? booking.url.trim() : '';
    const italian = resolveLocalizedText(booking.text, 'it', '');
    const english = resolveLocalizedText(booking.text, 'en', '');

    if (!url && !italian && !english) {
        return undefined;
    }

    return {
        text: {
            it: italian || english || 'Prenota',
            en: english || italian || 'Book now',
        },
        url,
    };
}

export function normalizeSiteContent(content) {
    if (typeof content !== 'object' || content === null) {
        return content;
    }

    const normalized = JSON.parse(JSON.stringify(content));

    if (Array.isArray(normalized.events?.items)) {
        normalized.events.items = normalized.events.items.map((event) => {
            const nextEvent = { ...event };
            const booking = normalizeEventBooking(event.booking);

            if (booking) {
                nextEvent.booking = booking;
            } else {
                delete nextEvent.booking;
            }

            return nextEvent;
        });
    }

    return normalized;
}

export function getContent(lang = 'it') {
    return normalizeSiteContent(siteContent);
}

export function getLangContent(lang = 'it') {
    const content = getContent();
    // Simple traversal to extract the specific language strings
    const traverse = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (hasOwnLocaleValue(obj, 'it') || hasOwnLocaleValue(obj, 'en')) {
            if (obj[lang] !== undefined) return obj[lang];
            if (obj.it !== undefined) return obj.it;
            return obj.en;
        }
        const newObj = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            newObj[key] = traverse(obj[key]);
        }
        return newObj;
    };
    return traverse(content);
}
