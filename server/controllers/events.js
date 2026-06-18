import { pool } from '../config/database.js'

const computeRemaining = (row) => {
    const dateStr = row.date instanceof Date
        ? row.date.toISOString().split('T')[0]
        : row.date
    const timeStr = typeof row.time === 'string'
        ? row.time
        : row.time.toISOString().split('T')[1].split('.')[0]
    const eventDateTime = new Date(`${dateStr}T${timeStr}`)
    return eventDateTime.getTime() - Date.now()
}

const formatEvent = (row) => ({
    id: row.id,
    title: row.title,
    date: row.date instanceof Date
        ? row.date.toISOString().split('T')[0]
        : row.date,
    time: typeof row.time === 'string'
        ? row.time
        : row.time.toISOString().split('T')[1].split('.')[0],
    image: row.image,
    location_id: row.location_id,
    location_name: row.location_name || undefined,
    remaining: computeRemaining(row)
})

const getAllEvents = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT events.*, locations.name AS location_name
            FROM events
            JOIN locations ON events.location_id = locations.id
            ORDER BY events.date, events.time
        `)
        res.json(rows.map(formatEvent))
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch events' })
    }
}

const getEventById = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT events.*, locations.name AS location_name
            FROM events
            JOIN locations ON events.location_id = locations.id
            WHERE events.id = $1
        `, [req.params.id])
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' })
        }
        res.json(formatEvent(rows[0]))
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch event' })
    }
}

const getEventsByLocationId = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM events
            WHERE location_id = $1
            ORDER BY date, time
        `, [req.params.locationId])
        res.json(rows.map(formatEvent))
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch events' })
    }
}

export default {
    getAllEvents,
    getEventById,
    getEventsByLocationId
}
