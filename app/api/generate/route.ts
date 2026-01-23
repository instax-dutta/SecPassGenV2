import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, isPasswordUnique, savePassword, hashIP } from '@/lib/db';

const MAX_ATTEMPTS = 100;

interface GeneratePasswordRequest {
    length: number;
    count: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
}

function generatePassword(charset: string, length: number): string {
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }
    return password;
}

export async function POST(request: NextRequest) {
    try {
        const body: GeneratePasswordRequest = await request.json();
        const { length, count, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = body;

        // Validation
        if (length < 8 || length > 128) {
            return NextResponse.json(
                { error: 'Password length must be between 8 and 128 characters' },
                { status: 400 }
            );
        }

        if (count < 1 || count > 10) {
            return NextResponse.json(
                { error: 'Password count must be between 1 and 10' },
                { status: 400 }
            );
        }

        // Build charset
        let charset = '';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?/~-=';

        if (charset.length === 0) {
            return NextResponse.json(
                { error: 'At least one character type must be selected' },
                { status: 400 }
            );
        }

        // Get IP for rate limiting (optional)
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const ipHash = await hashIP(ip);

        // Generate unique passwords
        // Generate candidate passwords in batches
        const passwords: string[] = [];
        const charsetConfig = {
            uppercase: includeUppercase,
            lowercase: includeLowercase,
            numbers: includeNumbers,
            symbols: includeSymbols,
        };

        let attempts = 0;
        const BATCH_SIZE = Math.min(count * 2, 20);

        while (passwords.length < count && attempts < 5) { // 5 batches max
            const batch: string[] = [];
            const hashes: string[] = [];

            for (let i = 0; i < BATCH_SIZE; i++) {
                const pw = generatePassword(charset, length);
                batch.push(pw);
                hashes.push(await hashPassword(pw));
            }

            // Check entire batch for uniqueness
            try {
                // If isPasswordUnique is still single-check, we should at least try
                // But let's assume we want to keep it simple or implement a batch check
                for (let i = 0; i < batch.length && passwords.length < count; i++) {
                    const pw = batch[i];
                    const hpw = hashes[i];

                    const isUnique = await isPasswordUnique(hpw);

                    if (isUnique && !passwords.includes(pw)) {
                        passwords.push(pw);
                        // Save asynchronously to not block the response
                        savePassword(hpw, length, charsetConfig, ipHash).catch(err =>
                            console.error('Async save failed:', err)
                        );
                    }
                }
            } catch (dbError) {
                console.error('Database uniqueness check failed, falling back to local uniqueness:', dbError);
                // If DB fails, just take the first 'count' passwords from the current batch
                // ensuring they are at least unique within the current batch
                for (const pw of batch) {
                    if (passwords.length < count && !passwords.includes(pw)) {
                        passwords.push(pw);
                    }
                }
                break; // Exit loop after fallback
            }

            attempts++;
        }

        if (passwords.length === 0) {
            // Ultimate fallback: generate without DB check if everything failed
            for (let i = 0; i < count; i++) {
                passwords.push(generatePassword(charset, length));
            }
        }

        return NextResponse.json({
            passwords,
            count: passwords.length,
            message: 'Success'
        });

    } catch (error) {
        console.error('Error generating passwords:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
