import { list } from '@vercel/blob';

export default async function handler(req, res) {
    // Simple auth check
    const authHeader = req.headers.authorization;
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    if (!ADMIN_TOKEN) {
        return res.status(500).json({ error: 'Configurazione mancante: ADMIN_TOKEN non impostato.' });
    }

    if (!authHeader || authHeader.trim() !== `Bearer ${ADMIN_TOKEN.trim()}`) {
        return res.status(401).json({ error: 'Autenticazione fallita' });
    }

    try {
        const { blobs } = await list();
        const totalSize = blobs.reduce((acc, blob) => acc + blob.size, 0);
        const limit = 1024 * 1024 * 1024; // 1GB

        return res.status(200).json({
            used: totalSize,
            limit: limit,
            percentage: (totalSize / limit) * 100,
            count: blobs.length
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
