/**
 * Secure Password History Manager
 * Stores password history in encrypted form in localStorage
 * Auto-expires after 24 hours
 */

const STORAGE_KEY = 'secpassgen_history';
const MAX_HISTORY = 10;
const EXPIRY_HOURS = 24;

export interface PasswordHistoryItem {
    id: string;
    password: string;
    length: number;
    timestamp: number;
    expiresAt: number;
}

interface EncryptedHistory {
    data: string;
    iv: string;
}

/**
 * Generate encryption key from browser fingerprint
 * This ensures history is device-specific
 */
async function getEncryptionKey(): Promise<CryptoKey> {
    const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    return crypto.subtle.importKey(
        'raw',
        hashBuffer,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt data using AES-GCM
 */
async function encrypt(data: string): Promise<EncryptedHistory> {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
    );

    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const ivArray = Array.from(iv);

    return {
        data: btoa(String.fromCharCode(...encryptedArray)),
        iv: btoa(String.fromCharCode(...ivArray))
    };
}

/**
 * Decrypt data using AES-GCM
 */
async function decrypt(encrypted: EncryptedHistory): Promise<string> {
    try {
        const key = await getEncryptionKey();
        const encryptedData = Uint8Array.from(atob(encrypted.data), c => c.charCodeAt(0));
        const iv = Uint8Array.from(atob(encrypted.iv), c => c.charCodeAt(0));

        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encryptedData
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    } catch (error) {
        console.error('Decryption failed:', error);
        return '[]';
    }
}

/**
 * Add password to history
 */
export async function addToHistory(password: string, length: number): Promise<void> {
    try {
        const history = await getHistory();
        const now = Date.now();

        const newItem: PasswordHistoryItem = {
            id: crypto.randomUUID(),
            password,
            length,
            timestamp: now,
            expiresAt: now + (EXPIRY_HOURS * 60 * 60 * 1000)
        };

        // Add to beginning and limit to MAX_HISTORY
        const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY);

        // Encrypt and store
        const encrypted = await encrypt(JSON.stringify(updatedHistory));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
    } catch (error) {
        console.error('Failed to add to history:', error);
    }
}

/**
 * Get password history (auto-removes expired items)
 */
export async function getHistory(): Promise<PasswordHistoryItem[]> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const encrypted: EncryptedHistory = JSON.parse(stored);
        const decrypted = await decrypt(encrypted);
        const history: PasswordHistoryItem[] = JSON.parse(decrypted);

        const now = Date.now();
        // Filter out expired items
        const validHistory = history.filter(item => item.expiresAt > now);

        // If we removed expired items, update storage
        if (validHistory.length !== history.length) {
            if (validHistory.length === 0) {
                localStorage.removeItem(STORAGE_KEY);
            } else {
                const encrypted = await encrypt(JSON.stringify(validHistory));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
            }
        }

        return validHistory;
    } catch (error) {
        console.error('Failed to get history:', error);
        return [];
    }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get history count
 */
export async function getHistoryCount(): Promise<number> {
    const history = await getHistory();
    return history.length;
}

/**
 * Check if history is available (browser supports required APIs)
 */
export function isHistoryAvailable(): boolean {
    return typeof window !== 'undefined' &&
        typeof localStorage !== 'undefined' &&
        typeof crypto !== 'undefined' &&
        typeof crypto.subtle !== 'undefined';
}
