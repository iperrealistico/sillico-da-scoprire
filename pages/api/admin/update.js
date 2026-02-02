export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Input Validation (Basic)
    const { content } = req.body;
    if (!content || typeof content !== 'object') {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    // Size limit check (approx 1MB)
    if (JSON.stringify(content).length > 1024 * 1024) {
        return res.status(413).json({ error: 'Payload too large' });
    }

    // 3. GitHub API Integration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const OWNER = process.env.GITHUB_OWNER;
    const REPO = process.env.GITHUB_REPO;
    const BRANCH = process.env.GITHUB_BRANCH || 'main';
    const FILE_PATH = process.env.GITHUB_FILE_PATH || 'content/site.json';

    try {
        // 3a. Get current file SHA
        const getFileResponse = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (!getFileResponse.ok) {
            const error = await getFileResponse.json();
            return res.status(500).json({ error: 'Failed to fetch file from GitHub', details: error });
        }

        const fileData = await getFileResponse.json();
        const sha = fileData.sha;

        // 3b. Update file
        const updateResponse = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Admin: Update site content',
                    content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
                    sha: sha,
                    branch: BRANCH,
                }),
            }
        );

        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            return res.status(500).json({ error: 'Failed to update file on GitHub', details: error });
        }

        const result = await updateResponse.json();
        return res.status(200).json({ success: true, sha: result.commit.sha });

    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
