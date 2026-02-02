import { put, del } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Increased for GPX or larger images
        },
    },
};

export default async function handler(req, res) {
    // 1. Method check
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed. Please use POST.` });
    }

    // 2. Authentication
    const authHeader = req.headers.authorization;
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    if (!ADMIN_TOKEN) {
        return res.status(500).json({ error: 'Server configuration error: ADMIN_TOKEN not set on host.' });
    }

    if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing token.' });
    }

    try {
        const { filename, contentType, oldUrl } = req.query;

        if (!filename) {
            return res.status(400).json({ error: 'Missing filename in query parameters.' });
        }

        // 3. Delete old image if it was a blob
        if (oldUrl && (oldUrl.includes('vercel-storage.com') || oldUrl.includes('public.blob.vercel-storage.com'))) {
            try {
                await del(oldUrl);
                console.log('Old blob deleted:', oldUrl);
            } catch (e) {
                console.warn('Failed to delete old blob (may already be gone):', e.message);
                // We continue anyway, as the upload is the primary goal
            }
        }

        // 4. Upload new file
        // Note: req is a ReadableStream in Next.js APIs for POST requests
        const blob = await put(filename, req, {
            access: 'public',
            contentType: contentType || 'application/octet-stream',
        });

        return res.status(200).json(blob);
    } catch (error) {
        console.error('Upload error details:', error);
        return res.status(500).json({
            error: 'Failed to upload to Vercel Blob.',
            details: error.message
        });
    }
}
