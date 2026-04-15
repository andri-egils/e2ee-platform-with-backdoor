import {
    SessionCipher,
    SignalProtocolAddress,
    MessageType,
} from '@privacyresearch/libsignal-protocol-typescript'
import { SignalProtocolStore } from './signalStore'

export async function encryptMessage(
    store: SignalProtocolStore,
    recipientShortCode: string,
    plaintext: string
): Promise<{ ciphertext: string | ArrayBuffer; messageType: number }> {
    const address = new SignalProtocolAddress(recipientShortCode, 1)
    const cipher  = new SessionCipher(store, address)

    const encoded   = new TextEncoder().encode(plaintext)
    const encrypted = await cipher.encrypt(encoded.buffer)

    return {
        ciphertext:  encrypted.body,   // keep as string, do not cast
        messageType: encrypted.type,
    }
}

export async function decryptMessage(
    store: SignalProtocolStore,
    senderShortCode: string,
    ciphertext: ArrayBuffer | string,
    messageType: number
): Promise<string> {
    const address = new SignalProtocolAddress(senderShortCode, 1)
    const cipher  = new SessionCipher(store, address)

    let decrypted: ArrayBuffer

    if (messageType === 3) {
        decrypted = await cipher.decryptPreKeyWhisperMessage(ciphertext, 'binary')
    } else {
        decrypted = await cipher.decryptWhisperMessage(ciphertext, 'binary')
    }

    return new TextDecoder().decode(decrypted)
}