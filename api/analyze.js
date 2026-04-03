export default async function handler(req, res) {
    // Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Mengambil API Key dari Environment Variables Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = "gemini-2.5-flash"; 

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key belum disetting di Vercel.' });
    }

    try {
        // Meneruskan request dari frontend ke server Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) // Payload langsung dari frontend
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Kembalikan balasan Gemini ke frontend
        res.status(200).json(data);

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: error.message || "Terjadi kesalahan internal." });
    }
}
