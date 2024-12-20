export const cookieOptions : any = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
};
// Type for user data in the request
export interface UserRequest extends Request {
    user: { _id: string }; // Define the expected shape of req.user
}