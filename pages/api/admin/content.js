import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
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

    try {
        const filePath = path.join(process.cwd(), 'content', 'site.json');

        // On Vercel, this will read the bundled file. 
        // However, we want the "latest" content. 
        // If we are on Vercel, we should probably fetch it from GitHub 
        // to avoid waiting for the build to finish.

        if (process.env.VERCEL) {
            const GITHUB_OWNER = process.env.GITHUB_OWNER;
            const GITHUB_REPO = process.env.GITHUB_REPO;
            const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
            const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
            const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'content/site.json';

            const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return res.status(200).json(data);
            }
        }

        // Fallback to local filesystem (works in dev or if GITHUB envs are missing)
        const fileContent = await fs.readFile(filePath, 'utf8');
        return res.status(200).json(JSON.parse(fileContent));

    } catch (error) {
        console.error('Error fetching content:', error);
        return res.status(500).json({ error: 'Failed to fetch content' });
    }
}
