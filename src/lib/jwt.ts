import { jwtVerify, SignJWT } from 'jose';
export interface JwtPayload {
    id: string
    username: string
    email: string
    role: string
    managedBy?: string | null
}

// Converting secret to Uint8Array
const getSecretKey = () => {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
        throw new Error('TOKEN_SECRET is not defined');
    }
    return new TextEncoder().encode(secret);
};

export const signJwtToken = async (payload: Omit<JwtPayload, 'iat' | 'exp'>) => {
    try {
        const token = await new SignJWT({ ...payload })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(getSecretKey());

        return token;
    } catch (error) {
        console.log("SignJwt Token Error: ", error);
        throw new Error('Failed to sign token');
    }
};

export const verifyJwtToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload as unknown as JwtPayload;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Token verification failed:', error);
        throw new Error(`Invalid token: ${error.message}`);
    }
};

