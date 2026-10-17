
import { Router } from 'express';
import pool from '../Database/db.js';

const olvasokRoutes = Router();

olvasokRoutes.get('/:id/kolcsonzesek', async (req, res) => {
    const id = req.params.id;

    try {
        const [olvasok] = await pool.query(
            'SELECT * FROM olvasok WHERE id = ?',
            [id]
        );

        if (olvasok.length === 0) {
            return res.status(404).json({
                hiba: 'Nincs ilyen olvasó.'
            });
        }

        const sql = `SELECT k.*, kv.cim AS konyvCim FROM kolcsonzesek k LEFT JOIN konyvek kv ON kv.id = k.konyvId WHERE k.olvasoId = ? ORDER BY k.id`;
        const [kolcsonzesek] = await pool.query(sql, [id]);
        res.json({
            olvaso: olvasok[0].nev,
            kolcsonzesek: kolcsonzesek
        });
    } catch (error) {
        res.status(500).json({
            hiba: 'Hiba történt a lekérdezéskor.'
        });
    }
});

export default olvasokRoutes;
