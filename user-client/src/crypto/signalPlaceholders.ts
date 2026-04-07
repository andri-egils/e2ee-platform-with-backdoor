export async function generatePrekeyBundle() {
  // TODO later
}

export async function encryptFor(shortCode: string, plaintext: string) {
  // TODO 
  return {
    ciphertext: "base64...",
    nonce: "base64...",
    ephemeral_public: "base64...",
    message_counter: 1,
    registration_id: 1234,
  }
}

export async function decryptMessage(payload) {
  // TODO
  return "Decrypted message text"
}