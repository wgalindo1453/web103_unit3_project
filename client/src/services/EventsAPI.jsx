const getAllEvents = async () => {
    const res = await fetch('/api/events')
    if (!res.ok) throw new Error('Failed to fetch events')
    return res.json()
}

const getEventsById = async (id) => {
    const res = await fetch(`/api/events/${id}`)
    if (!res.ok) throw new Error('Failed to fetch event')
    return res.json()
}

const getEventsByLocationId = async (locationId) => {
    const res = await fetch(`/api/events/location/${locationId}`)
    if (!res.ok) throw new Error('Failed to fetch events')
    return res.json()
}

export default {
    getAllEvents,
    getEventsById,
    getEventsByLocationId
}
