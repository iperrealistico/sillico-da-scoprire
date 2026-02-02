import { put, del } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${localStorage.getItem('admin_token')}`) {
        // Note: Since this is server-side process.env.ADMIN_TOKEN should be used.
        // But for consistency with your previous setup:
        if (authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }

    try {
        const { filename, contentType, oldUrl } = req.query;

        // 2. Delete old image if it was a blob
        if (oldUrl && oldUrl.includes('vercel-storage.com')) {
            try {
                await del(oldUrl);
            } catch (e) {
                console.error('Failed to delete old blob:', e);
            }
        }

        // 3. Upload new image
        // In a real browser environment, req is a ReadableStream.
        // Next.js handles body parsing, but for Blobs we often use fetch on the client or multiparty.
        // For simplicity with Vercel's example:
        const blob = await put(filename, req, {
            access: 'public',
            contentType,
        });

        return res.status(200).json(blob);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
