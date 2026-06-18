import { pool } from '../config/database.js'

const getAllLocations = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM locations ORDER BY id')
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch locations' })
    }
}

const getLocationById = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM locations WHERE id = $1', [req.params.id])
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' })
        }
        res.json(rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch location' })
    }
}

export default {
    getAllLocations,
    getLocationById
}
