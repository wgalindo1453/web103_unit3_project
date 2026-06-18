import React, { useState, useEffect, useRef } from 'react'
import EventsAPI from '../services/EventsAPI'
import dates from '../utils/dates'
import '../css/Event.css'

const Event = (props) => {
    const [event, setEvent] = useState({})
    const [time, setTime] = useState('')
    const [remaining, setRemaining] = useState('')
    const remainingMsRef = useRef(null)
    const fetchedAtRef = useRef(null)

    useEffect(() => {
        (async () => {
            try {
                const eventData = await EventsAPI.getEventsById(props.id)
                setEvent(eventData)
                remainingMsRef.current = eventData.remaining
                fetchedAtRef.current = Date.now()
            } catch (error) {
                console.error(error)
            }
        })()
    }, [props.id])

    useEffect(() => {
        if (!event.time) return

        (async () => {
            try {
                const result = await dates.formatTime(event.time)
                setTime(result)
            } catch (error) {
                console.error(error)
            }
        })()
    }, [event.time])

    useEffect(() => {
        if (remainingMsRef.current === null) return

        const updateRemaining = async () => {
            const elapsed = Date.now() - fetchedAtRef.current
            const currentRemaining = remainingMsRef.current - elapsed
            const timeRemaining = await dates.formatRemainingTime(currentRemaining)
            setRemaining(timeRemaining)
            dates.formatNegativeTimeRemaining(timeRemaining, event.id)
        }

        updateRemaining()
        const interval = setInterval(updateRemaining, 1000)
        return () => clearInterval(interval)
    }, [event.id, event.remaining])

    return (
        <article className='event-information'>
            <img src={event.image} alt={event.title} />

            <div className='event-information-overlay'>
                <div className='text'>
                    <h3>{event.title}</h3>
                    <p><i className="fa-regular fa-calendar fa-bounce"></i> {event.date} <br /> {time}</p>
                    <p id={`remaining-${event.id}`}>{remaining}</p>
                </div>
            </div>
        </article>
    )
}

export default Event
