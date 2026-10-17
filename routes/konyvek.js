
import { Router } from 'express';
import pool from '../Database/db.js';

const konyvekRoutes = Router();


konyvekRoutes.get('/elerheto', async (req, res) => {
    const sql = `
        SELECT * FROM konyvek WHERE id NOT IN (SELECT konyvId FROM kolcsonzesek WHERE LOWER(CAST(visszahozva AS CHAR)) = 'false' OR visszahozva = '0')`;

    try {
        const [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: 'Adatbázishiba.' });
    }
});


konyvekRoutes.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const [konyvek] = await pool.query(
            'SELECT * FROM konyvek WHERE id = ?',
            [id]
        );

        if (konyvek.length === 0) {
            return res.status(404).json({ hiba: 'Nincs ilyen könyv.' });
        }

        const [kolcsonzesek] = await pool.query(
            'SELECT * FROM kolcsonzesek WHERE konyvId = ?',
            [id]
        );

        if (kolcsonzesek.length > 0) {
            return res.status(409).json({
                hiba: 'A könyvhöz kölcsönzés tartozik, ezért nem törölhető.'
            });
        }

        await pool.query('DELETE FROM konyvek WHERE id = ?', [id]);

        res.json({ uzenet: 'A könyv törölve.' });
    } catch (error) {
        res.status(500).json({ hiba: 'Hiba történt a törléskor.' });
    }
});

export default konyvekRoutes;
