import { list } from '@vercel/blob';

export default async function handler(req, res) {
    // Simple auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
        return res.status(401).json({ error: 'Unauthorized' });
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
