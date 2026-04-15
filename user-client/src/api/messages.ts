import { io, Socket } from 'socket.io-client'
import axios from 'axios'
import { arrayBufferToBase64, base64ToArrayBuffer } from '../crypto/keyGeneration'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'

let socket: Socket | null = null

export function connectSocket(
    token: string,
    onMessage: (senderShortCode: string, payload: any) => void
): void {
    socket = io(BASE_URL, { auth: { token } })

    socket.on('connect', () => {
        console.log('[socket] connected')
    })

    socket.on('receive_message', (data) => {
        onMessage(data.sender_short_code, data.payload)
    })

    socket.on('disconnect', () => {
        console.log('[socket] disconnected')
    })
}

export function disconnectSocket(): void {
    socket?.disconnect()
    socket = null
}

export async function sendMessage(
    token: string,
    recipientShortCode: string,
    ciphertext: ArrayBuffer | string,
    messageType: number
): Promise<void> {
    // libsignal returns body as a string, handle both cases
    const ciphertextB64 = typeof ciphertext === 'string'
        ? btoa(ciphertext)
        : arrayBufferToBase64(ciphertext)

    await axios.post(`${BASE_URL}/messages/send`, {
        recipient_short_code: recipientShortCode,
        payload: {
            ciphertext:   ciphertextB64,
            message_type: messageType,
        }
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
}