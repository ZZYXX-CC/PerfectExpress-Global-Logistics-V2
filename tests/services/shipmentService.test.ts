import { describe, it, expect, vi, beforeEach } from 'vitest'

// Test the pure function directly (not the async one that uses Supabase)
describe('generateTrackingNumber', () => {
    it('generates a tracking number with PFX- prefix', async () => {
        // Import the actual function
        const { generateTrackingNumber } = await import('../../services/shipmentService')

        const trackingNumber = generateTrackingNumber()

        expect(trackingNumber).toMatch(/^PFX-\d{8}$/)
    })

    it('generates unique tracking numbers', async () => {
        const { generateTrackingNumber } = await import('../../services/shipmentService')

        const numbers = new Set()
        for (let i = 0; i < 100; i++) {
            numbers.add(generateTrackingNumber())
        }

        // All 100 should be unique (statistically very likely)
        expect(numbers.size).toBe(100)
    })
})

describe('ShipmentData interface', () => {
    it('accepts valid shipment data structure', async () => {
        const { createShipment } = await import('../../services/shipmentService')

        const validData = {
            sender_info: {
                name: 'John Doe',
                email: 'john@example.com',
                address: '123 Main St, New York, NY',
                phone: '+1234567890'
            },
            receiver_info: {
                name: 'Jane Smith',
                email: 'jane@example.com',
                address: '456 Oak Ave, Los Angeles, CA',
                phone: '+0987654321'
            },
            parcel_details: {
                description: 'Electronics',
                weight: '2.5',
                quantity: '1',
                type: 'box'
            }
        }

        // Function should be callable with valid data
        expect(typeof createShipment).toBe('function')

        // Mock is set up in setup.ts, so this won't hit real Supabase
        const result = await createShipment(validData)

        // With our mock, it should return success
        expect(result).toHaveProperty('success')
    })
})
