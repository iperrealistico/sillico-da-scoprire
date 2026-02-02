import { del } from '@vercel/blob';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Authentication
    const authHeader = req.headers.authorization;
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    if (!ADMIN_TOKEN) {
        return res.status(500).json({ error: 'Server not configured' });
    }

    if (!authHeader || authHeader.trim() !== `Bearer ${ADMIN_TOKEN.trim()}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL' });
    }

    // Check if it's a Vercel Blob URL
    if (!url.includes('vercel-storage.com') && !url.includes('public.blob.vercel-storage.com')) {
        return res.status(400).json({ error: 'Not a Vercel Blob URL' });
    }

    try {
        await del(url);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ error: error.message });
    }
}
