const formatTime = async (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
}

const formatRemainingTime = async (ms) => {
    if (ms === undefined || ms === null) return ''

    const absMs = Math.abs(ms)
    const seconds = Math.floor(absMs / 1000) % 60
    const minutes = Math.floor(absMs / (1000 * 60)) % 60
    const hours = Math.floor(absMs / (1000 * 60 * 60)) % 24
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24))

    if (ms < 0) {
        return `Event passed ${days}d ${hours}h ${minutes}m ${seconds}s ago`
    }

    if (days > 0) {
        return `${days} days, ${hours} hours, ${minutes} minutes remaining`
    }
    if (hours > 0) {
        return `${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`
    }
    return `${minutes} minutes, ${seconds} seconds remaining`
}

const formatNegativeTimeRemaining = (remainingText, eventId) => {
    const element = document.getElementById(`remaining-${eventId}`)
    if (!element) return

    if (remainingText && remainingText.includes('passed')) {
        element.classList.add('negative-time-remaining')
    } else {
        element.classList.remove('negative-time-remaining')
    }
}

export default {
    formatTime,
    formatRemainingTime,
    formatNegativeTimeRemaining
}
