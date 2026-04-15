import axios from 'axios'
import type { ServerPrekeyBundle } from '../crypto/x3dh'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'

export async function uploadPrekeyBundle(token: string, bundle: object): Promise<void> {
    await axios.post(`${BASE_URL}/keys/upload`, bundle, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export async function fetchPrekeyBundle(
    token: string,
    shortCode: string
): Promise<ServerPrekeyBundle> {
    const response = await axios.get(`${BASE_URL}/keys/${shortCode}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}