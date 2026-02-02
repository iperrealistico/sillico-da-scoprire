export default function handler(req, res) {
    res.status(200).json({ status: 'Admin endpoint is active. Access via POST /api/admin/update with proper authentication.' });
}
