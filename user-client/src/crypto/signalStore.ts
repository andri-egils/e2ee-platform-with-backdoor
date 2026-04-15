import {
    SignalProtocolAddress,
    SessionRecordType,
    Direction,
    StorageType,
} from '@privacyresearch/libsignal-protocol-typescript'
import {
    loadIdentityKey,
    loadSignedPrekey,
    loadOneTimePrekey,
    deleteOneTimePrekey,
    saveSession,
    loadSession,
} from '../storage/idb'
import { base64ToArrayBuffer, arrayBufferToBase64 } from './keyGeneration'

export class SignalProtocolStore implements StorageType {
    private registrationId: number
    private identityKeyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer } | null = null

    constructor(registrationId: number) {
        this.registrationId = registrationId
    }

    // ── Identity ──────────────────────────────────────────────────────────────
    async getIdentityKeyPair() {
        if (this.identityKeyPair) return this.identityKeyPair
        const stored = await loadIdentityKey()
        if (!stored) throw new Error('Identity key not found')
        this.identityKeyPair = stored
        return stored
    }

    async getLocalRegistrationId(): Promise<number> {
        return this.registrationId
    }

    async isTrustedIdentity(
        identifier: string,
        identityKey: ArrayBuffer,
        _direction: Direction
    ): Promise<boolean> {
        // For this project we trust all identities
        // In production you would verify against a trusted key store
        return true
    }

    async saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
        return true
    }

    async loadIdentityKey(identifier: string): Promise<ArrayBuffer | undefined> {
        return undefined
    }

    // ── Signed Prekey ─────────────────────────────────────────────────────────
    async loadSignedPreKey(keyId: number) {
        const stored = await loadSignedPrekey(keyId)
        if (!stored) throw new Error(`Signed prekey ${keyId} not found`)
        return {
            pubKey:  stored.pubKey,
            privKey: stored.privKey,
        }
    }

    async storeSignedPreKey(keyId: number, keyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }) {
        // Already stored during key generation
    }

    async removeSignedPreKey(keyId: number) {
        // Handle SPK rotation later
    }

    // ── One-time Prekeys ──────────────────────────────────────────────────────
    async loadPreKey(keyId: number) {
        const stored = await loadOneTimePrekey(keyId)
        if (!stored) throw new Error(`One time prekey ${keyId} not found`)
        return {
            pubKey:  stored.pubKey,
            privKey: stored.privKey,
        }
    }

    async storePreKey(keyId: number, keyPair: { pubKey: ArrayBuffer; privKey: ArrayBuffer }) {
        // Already stored during key generation
    }

    async removePreKey(keyId: number) {
        await deleteOneTimePrekey(keyId)
    }

    // ── Sessions ──────────────────────────────────────────────────────────────
    async loadSession(identifier: string): Promise<SessionRecordType | undefined> {
        const stored = await loadSession(identifier)
        if (!stored) return undefined
        // Deserialize from ArrayBuffer back to session record
        const text = new TextDecoder().decode(stored)
        return JSON.parse(text)
    }

    async storeSession(identifier: string, record: SessionRecordType): Promise<void> {
        // Serialize session record to ArrayBuffer for IndexedDB storage
        const text    = JSON.stringify(record)
        const encoded = new TextEncoder().encode(text)
        await saveSession(identifier, encoded.buffer)
    }

    async removeSession(identifier: string): Promise<void> {
        // Handle session removal if needed
    }

    async removeAllSessions(identifier: string): Promise<void> {
        // Handle clearing all sessions if needed
    }
}