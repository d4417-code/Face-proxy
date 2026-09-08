const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const FACES_DIR = './faces';
if (!fs.existsSync(FACES_DIR)) {
    fs.mkdirSync(FACES_DIR);
}

app.use(express.json({ limit: '50mb' }));

app.post('/save', (req, res) => {
    const { id, img } = req.body;
    if (!id || !img) {
        return res.status(400).json({ error: 'Missing id or img' });
    }
    try {
        const base64 = img.replace(/^data:image\/jpeg;base64,/, '');
        const buffer = Buffer.from(base64, 'base64');
        const filePath = `${FACES_DIR}/${id}.jpg`;
        fs.writeFileSync(filePath, buffer);
        res.json({ status: 'saved', id: id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const filePath = `${FACES_DIR}/${id}.jpg`;
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath, { root: '.' });
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
