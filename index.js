import express from 'express';
import konyvekRoutes from './routes/konyvek.js';
import olvasokRoutes from './routes/olvasok.js';
import kolcsonzesekRoutes from './routes/kolcsonzesek.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Könyvtár API működik!');
});

app.use('/konyvek', konyvekRoutes);
app.use('/olvasok', olvasokRoutes);
app.use('/kolcsonzesek', kolcsonzesekRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});