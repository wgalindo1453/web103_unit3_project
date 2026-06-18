import React, { useState, useEffect } from 'react'
import LocationsAPI from '../services/LocationsAPI'
import EventsAPI from '../services/EventsAPI'
import Event from '../components/Event'
import '../css/Events.css'

const Events = () => {
    const [events, setEvents] = useState([])
    const [locations, setLocations] = useState([])
    const [locationFilter, setLocationFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('asc')

    useEffect(() => {
        (async () => {
            try {
                const [eventsData, locationsData] = await Promise.all([
                    EventsAPI.getAllEvents(),
                    LocationsAPI.getAllLocations()
                ])
                setEvents(eventsData)
                setLocations(locationsData)
            } catch (error) {
                console.error(error)
            }
        })()
    }, [])

    const filteredEvents = events
        .filter(event => locationFilter === 'all' || String(event.location_id) === locationFilter)
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
        })

    return (
        <div className='events-page'>
            <div className='events-controls'>
                <label>
                    Filter by location:
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        <option value='all'>All Locations</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={String(loc.id)}>{loc.name}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Sort by date:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value='asc'>Earliest first</option>
                        <option value='desc'>Latest first</option>
                    </select>
                </label>
            </div>

            <main className='events-list'>
                {filteredEvents.length > 0 ? filteredEvents.map(event => (
                    <Event
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        date={event.date}
                        time={event.time}
                        image={event.image}
                    />
                )) : (
                    <h2><i className="fa-regular fa-calendar-xmark fa-shake"></i> No events found</h2>
                )}
            </main>
        </div>
    )
}

export default Events
