import {
    SessionBuilder,
    PreKeyWhisperMessage,
    SignalProtocolAddress,
} from '@privacyresearch/libsignal-protocol-typescript'
import { SignalProtocolStore } from './signalStore'
import { base64ToArrayBuffer } from './keyGeneration'

export interface ServerPrekeyBundle {
    short_code:    string
    ik_public:     string
    spk_id:        number
    spk_public:    string
    spk_signature: string
    opk: {
        id:     number
        public: string
    } | null
}

export async function initializeSession(
    store: SignalProtocolStore,
    bundle: ServerPrekeyBundle
): Promise<void> {
    // Convert base64 bundle from server into ArrayBuffers for libsignal
    const processedBundle = {
        registrationId:  0,
        identityKey:     base64ToArrayBuffer(bundle.ik_public),
        signedPreKey: {
            keyId:     bundle.spk_id,
            publicKey: base64ToArrayBuffer(bundle.spk_public),
            signature: base64ToArrayBuffer(bundle.spk_signature),
        },
        preKey: bundle.opk ? {
            keyId:     bundle.opk.id,
            publicKey: base64ToArrayBuffer(bundle.opk.public),
        } : undefined,
    }

    // Address format is "shortCode.1" — the .1 is the device id (single device)
    const address        = new SignalProtocolAddress(bundle.short_code, 1)
    const sessionBuilder = new SessionBuilder(store, address)

    await sessionBuilder.processPreKey(processedBundle)
    console.log(`[x3dh] Session initialized with ${bundle.short_code}`)
}