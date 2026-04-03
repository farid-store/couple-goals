export default async function handler(req, res) {
    // Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Mengambil API Key dari Environment Variables Vercel
    let apiKey = process.env.GEMINI_API_KEY;

    // CEK 1: Apakah Key benar-benar kosong/belum terbaca Vercel?
    if (!apiKey) {
        return res.status(500).json({ error: 'DEBUG: API Key KOSONG. Pastikan nama variabel di Vercel huruf besar semua (GEMINI_API_KEY) dan kamu sudah melakukan Redeploy!' });
    }

    // CEK 2: Bersihkan spasi berlebih atau tanda kutip yang tidak sengaja ter-paste
    apiKey = apiKey.trim().replace(/['"]/g, '');

    // CEK 3: Apakah format Key valid? (Key Gemini selalu diawali "AIza")
    if (!apiKey.startsWith("AIza")) {
        return res.status(500).json({ error: 'DEBUG: API Key terbaca, tapi formatnya salah/typo. Key saat ini terbaca sebagai: ' + apiKey.substring(0, 5) + '...' });
    }

    const modelName = "gemini-2.5-flash"; 

    try {
        // Meneruskan request dari frontend ke server Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        // CEK 4: Jika Google menolak request-nya
        if (data.error) {
            return res.status(500).json({ error: "DEBUG GOOGLE ERROR: " + data.error.message });
        }

        // Jika sukses, kembalikan balasan Gemini ke frontend
        res.status(200).json(data);

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan internal server: " + error.message });
    }
}
