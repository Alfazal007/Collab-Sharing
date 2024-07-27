import axios from "axios";

export async function authenticatedUser(
    token: string,
    email: string
): Promise<boolean> {
    try {
        const userFromTheDB = await axios.post(process.env.AUTH_URL || "", {
            token,
            email,
        });
        return userFromTheDB.data as boolean; // returns false or true
    } catch (err) {
        return false;
    }
}
