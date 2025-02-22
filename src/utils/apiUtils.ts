import axios from "axios";

function stringToBuffer(str: string): ArrayBuffer {
    return new TextEncoder().encode(str);
}

function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export const generateFirstPartyHeaders = async (path: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const firstPartyId = import.meta.env.VITE_FIRST_PARTY_ID;
    const secret = import.meta.env.VITE_FIRST_PARTY_SECRET;
    const signatureMessage = `${path}${timestamp}${firstPartyId}`;

    const messageBuffer = stringToBuffer(signatureMessage);
    const secretBuffer = stringToBuffer(secret);

    const key = await crypto.subtle.importKey(
        'raw',
        secretBuffer,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        messageBuffer
    );

    const signatureHex = bufferToHex(signature);

    return {
        'First-Party-Id': firstPartyId,
        'First-Party-Signature': signatureHex,
        'First-Party-Timestamp': timestamp.toString(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const makeAuthenticatedRequest = async (path: string, token: string) => {
    const headers = await generateFirstPartyHeaders(path);
    
    return axios.get(`${import.meta.env.VITE_API_URL}${path}`, {
        headers: {
            ...headers,
            'Authorization': `Bearer ${token}`
        }
    });
};