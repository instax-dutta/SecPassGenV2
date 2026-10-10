import { NextRequest, NextResponse } from 'next/server';
import { buildCharset, meetsEntropyFloor, minimumLengthForFlags, totalEntropy, MIN_ENTROPY_BITS, MIN_LENGTH, MAX_LENGTH, type CharsetFlags } from '@/lib/entropy';
import { generatePassword } from '@/lib/random';
import { hashPassword, hashIP, recordPassword, resolveIpPepper } from '@/lib/db';
import { requireUniquenessSecret } from '@/lib/hashing';

const MAX_COUNT = 10;
const MAX_COLLISION_RETRIES = 8;

interface GeneratePasswordRequest {
    length: number;
    count: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
}

function entropyFloorRejection(flags: CharsetFlags, length: number) {
    const bits = totalEntropy(flags, length);
    const minimum = minimumLengthForFlags(flags);
    return NextResponse.json(
        {
            error: `Password too weak: ${bits.toFixed(1)} bits of entropy is below the ${MIN_ENTROPY_BITS} bit floor.`,
            bits: Number(bits.toFixed(2)),
            requiredBits: MIN_ENTROPY_BITS,
            minimumLength: Number.isFinite(minimum) ? minimum : null,
        },
        { status: 400 }
    );
}

export async function POST(request: NextRequest) {
    try {
        const body: GeneratePasswordRequest = await request.json();
        const { length, count, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = body;

        if (!Number.isInteger(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
            return NextResponse.json(
                { error: `Password length must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters` },
                { status: 400 }
            );
        }

        if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
            return NextResponse.json(
                { error: `Password count must be between 1 and ${MAX_COUNT}` },
                { status: 400 }
            );
        }

        const flags: CharsetFlags = { includeUppercase, includeLowercase, includeNumbers, includeSymbols };
        const charset = buildCharset(flags);

        if (charset.length === 0) {
            return NextResponse.json(
                { error: 'At least one character type must be selected' },
                { status: 400 }
            );
        }

        // Uniqueness is established here rather than by a lookup. Above the floor
        // a duplicate is unobservable by the birthday bound, so the table is a
        // cross-check and a source of aggregate stats, not the uniqueness oracle.
        if (!meetsEntropyFloor(flags, length)) {
            return entropyFloorRejection(flags, length);
        }

        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        let ipHash: string | undefined;
        try {
            ipHash = await hashIP(ip, resolveIpPepper());
        } catch {
            ipHash = undefined;
        }

        const charsetConfig = {
            uppercase: includeUppercase,
            lowercase: includeLowercase,
            numbers: includeNumbers,
            symbols: includeSymbols,
        };

        const passwords: string[] = [];
        const batch = new Set<string>();
        let recorded = true;

        // The write is best effort. A database outage must not stop someone
        // getting a strong password, and the entropy floor already carries the
        // uniqueness property on its own.
        try {
            requireUniquenessSecret();
            recorded = true;
        } catch (error) {
            recorded = false;
            console.error('Uniqueness recording disabled:', error);
        }

        let attempts = 0;
        while (passwords.length < count && attempts < MAX_COLLISION_RETRIES * MAX_COUNT) {
            const candidate = generatePassword(charset, length);
            if (batch.has(candidate)) continue;
            batch.add(candidate);

            if (recorded) {
                try {
                    const isNew = await recordPassword(
                        await hashPassword(candidate),
                        length,
                        charsetConfig,
                        ipHash
                    );
                    if (!isNew) {
                        // Already issued. Draw again rather than serve a repeat.
                        continue;
                    }
                } catch (error) {
                    console.error('Recording failed, serving without the cross-check:', error);
                    recorded = false;
                }
            }

            passwords.push(candidate);
            attempts += 1;
        }

        return NextResponse.json({
            passwords,
            count: passwords.length,
            entropyBits: Number(totalEntropy(flags, length).toFixed(2)),
            recorded,
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
