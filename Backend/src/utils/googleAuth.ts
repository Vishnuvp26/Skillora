import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error("Invalid Google token");

        return {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            profilePic: payload.picture,
        };
    } catch (error) {
        throw new Error("Failed to verify Google token");
    }
};