
'use server';

import { cookies } from 'next/headers';
import { unsealData, sealData } from 'iron-session';
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const sessionPassword = process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long_for_dev';

const cookieName = 'auth_session';
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

interface SessionData {
    username: string;
}

export async function createSession(data: SessionData) {
    const sealedData = await sealData(data, { password: sessionPassword });
    cookies().set(cookieName, sealedData, cookieOptions);
}

export async function getSession(): Promise<SessionData | null> {
    const cookie = cookies().get(cookieName);
    if (!cookie) return null;
    
    try {
        const data = await unsealData<SessionData>(cookie.value, { password: sessionPassword });
        return data;
    } catch (error) {
        console.error("Failed to unseal session:", error);
        return null;
    }
}

export async function getSessionFromCookie(cookieStore: { get: (name: string) => RequestCookie | undefined }): Promise<SessionData | null> {
    const cookie = cookieStore.get(cookieName);
     if (!cookie) return null;

    try {
        const data = await unsealData<SessionData>(cookie.value, { password: sessionPassword });
        return data;
    } catch (error) {
        return null;
    }
}


export async function deleteSession() {
    cookies().delete(cookieName);
}
