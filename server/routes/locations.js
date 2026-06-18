import express from 'express'
import LocationsController from '../controllers/locations.js'

const router = express.Router()

router.get('/', LocationsController.getAllLocations)
router.get('/:id', LocationsController.getLocationById)

export default router
