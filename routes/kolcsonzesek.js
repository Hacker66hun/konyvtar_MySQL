
import { Router } from 'express';
import pool from '../Database/db.js';

const kolcsonzesekRoutes = Router();


kolcsonzesekRoutes.get('/', async (req, res) => {
    let sql = `SELECT k.*, kv.cim AS konyvCim, o.nev AS olvasoNev FROM kolcsonzesek k LEFT JOIN konyvek kv ON kv.id = k.konyvId LEFT JOIN olvasok o ON o.id = k.olvasoId`;

    if (req.query.aktiv === 'true') {
        sql += `WHERE LOWER(CAST(k.visszahozva AS CHAR)) = 'false' OR k.visszahozva = '0'`;
    }

    sql += ' ORDER BY k.id';

    try {
        const [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: 'Adatbázishiba.' });
    }
});


kolcsonzesekRoutes.post('/', async (req, res) => {
    const { konyvId, olvasoId } = req.body;

    if (!konyvId || !olvasoId) {
        return res.status(400).json({
            hiba: 'A konyvId és az olvasoId kötelező.'
        });
    }

    try {
        const [konyvek] = await pool.query(
            'SELECT * FROM konyvek WHERE id = ?',
            [konyvId]
        );

        if (konyvek.length === 0) {
            return res.status(404).json({ hiba: 'Nincs ilyen könyv.' });
        }

        const [olvasok] = await pool.query(
            'SELECT * FROM olvasok WHERE id = ?',
            [olvasoId]
        );

        if (olvasok.length === 0) {
            return res.status(404).json({ hiba: 'Nincs ilyen olvasó.' });
        }

        const [aktiv] = await pool.query(
            `SELECT * FROM kolcsonzesek
             WHERE konyvId = ?
             AND (LOWER(CAST(visszahozva AS CHAR)) = 'false'
                  OR visszahozva = '0')`,
            [konyvId]
        );

        if (aktiv.length > 0) {
            return res.status(409).json({
                hiba: 'Ez a könyv már ki van kölcsönözve.'
            });
        }

        const [eredmeny] = await pool.query(
            `INSERT INTO kolcsonzesek
             (konyvId, olvasoId, datum, visszahozva)
             VALUES (?, ?, CURDATE(), 'false')`,
            [konyvId, olvasoId]
        );

        res.status(201).json({
            uzenet: 'Sikeres kölcsönzés.',
            id: eredmeny.insertId
        });
    } catch (error) {
        res.status(500).json({ hiba: 'Hiba történt a kölcsönzéskor.' });
    }
});


kolcsonzesekRoutes.patch('/:id/visszahoz', async (req, res) => {
    const id = req.params.id;

    try {
        const [kolcsonzesek] = await pool.query(
            'SELECT * FROM kolcsonzesek WHERE id = ?',
            [id]
        );

        if (kolcsonzesek.length === 0) {
            return res.status(404).json({
                hiba: 'Nincs ilyen kölcsönzés.'
            });
        }

        const visszahozva = String(
            kolcsonzesek[0].visszahozva
        ).toLowerCase();

        if (visszahozva === 'true' || visszahozva === '1') {
            return res.status(409).json({
                hiba: 'A könyvet már visszahozták.'
            });
        }

        await pool.query(
            `UPDATE kolcsonzesek
             SET visszahozva = 'true',
                 visszahozasDatum = CURDATE()
             WHERE id = ?`,
            [id]
        );

        res.json({ uzenet: 'A visszahozás rögzítve.' });
    } catch (error) {
        res.status(500).json({ hiba: 'Hiba történt a módosításkor.' });
    }
});

export default kolcsonzesRoutes;
