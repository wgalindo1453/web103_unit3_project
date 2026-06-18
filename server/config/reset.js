import dotenv from 'dotenv'
import { pool } from './database.js'

dotenv.config()

const createLocationsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS locations (
            id serial PRIMARY KEY,
            name varchar(255) NOT NULL,
            image text NOT NULL,
            address varchar(255) NOT NULL,
            city varchar(100) NOT NULL,
            state varchar(50) NOT NULL,
            zip varchar(20) NOT NULL
        );
    `

    try {
        await pool.query(query)
        console.log('locations table created successfully')
    } catch (err) {
        console.error('error creating locations table', err)
    }
}

const createEventsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS events (
            id serial PRIMARY KEY,
            title varchar(255) NOT NULL,
            date date NOT NULL,
            time time NOT NULL,
            image text NOT NULL,
            location_id int NOT NULL REFERENCES locations(id)
        );
    `

    try {
        await pool.query(query)
        console.log('events table created successfully')
    } catch (err) {
        console.error('error creating events table', err)
    }
}

const seedLocations = async () => {
    const query = `
        INSERT INTO locations (id, name, image, address, city, state, zip)
        VALUES
            (1, 'Echo Lounge', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
             '1321 N Stemmons Fwy', 'Dallas', 'TX', '75207'),
            (2, 'House of Blues Dallas', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
             '2200 N Lamar St', 'Dallas', 'TX', '75202'),
            (3, 'Dos Equis Pavilion', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
             '1818 First Ave', 'Dallas', 'TX', '75210'),
            (4, 'American Airlines Center', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
             '2500 Victory Ave', 'Dallas', 'TX', '75219')
        ON CONFLICT (id) DO NOTHING;
    `

    try {
        const { rows } = await pool.query('SELECT COUNT(*) FROM locations')
        if (parseInt(rows[0].count) === 0) {
            await pool.query(query)
            await pool.query(`SELECT setval('locations_id_seq', (SELECT MAX(id) FROM locations))`)
            console.log('locations seeded successfully')
        } else {
            console.log('locations already seeded, skipping')
        }
    } catch (err) {
        console.error('error seeding locations', err)
    }
}

const seedEvents = async () => {
    const query = `
        INSERT INTO events (title, date, time, image, location_id)
        VALUES
            ('Jazz Night Live', '2025-03-15', '20:00:00', 'https://images.unsplash.com/photo-1415201364774-f6f0f35f28f5?w=400', 1),
            ('Open Mic Monday', '2026-08-20', '19:00:00', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', 1),
            ('Blues Jam Session', '2024-11-10', '21:00:00', 'https://images.unsplash.com/photo-1459749411175-04bf5297ceea?w=400', 1),

            ('Southern Rock Revival', '2026-09-05', '19:30:00', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400', 2),
            ('Gospel Brunch', '2026-07-14', '11:00:00', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', 2),
            ('Blues Legends Tribute', '2024-09-22', '20:00:00', 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=400', 2),

            ('Summer Concert Series', '2026-10-12', '18:30:00', 'https://images.unsplash.com/photo-1540039155733-5bb30b6cc53c?w=400', 3),
            ('Country Music Festival', '2026-11-25', '17:00:00', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400', 3),
            ('Rock Under the Stars', '2024-08-18', '19:00:00', 'https://images.unsplash.com/photo-1458560871787-56d23706c091?w=400', 3),

            ('Mavericks Game Night', '2026-12-08', '19:30:00', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400', 4),
            ('Stars Hockey Fan Fest', '2027-01-20', '18:00:00', 'https://images.unsplash.com/photo-1518605348174-a87dd313c348?w=400', 4),
            ('Championship Concert', '2024-06-05', '20:00:00', 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4bd?w=400', 4);
    `

    try {
        const { rows } = await pool.query('SELECT COUNT(*) FROM events')
        if (parseInt(rows[0].count) === 0) {
            await pool.query(query)
            console.log('events seeded successfully')
        } else {
            console.log('events already seeded, skipping')
        }
    } catch (err) {
        console.error('error seeding events', err)
    }
}

const reset = async () => {
    await createLocationsTable()
    await createEventsTable()
    await seedLocations()
    await seedEvents()
    await pool.end()
}

reset()
