import siteContent from '../content/site.json';

export function getContent(lang = 'it') {
    return siteContent;
}

export function getLangContent(lang = 'it') {
    const content = getContent();
    // Simple traversal to extract the specific language strings
    const traverse = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (obj.it !== undefined && obj.en !== undefined) {
            return obj[lang] || obj.it;
        }
        const newObj = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            newObj[key] = traverse(obj[key]);
        }
        return newObj;
    };
    return traverse(content);
}
