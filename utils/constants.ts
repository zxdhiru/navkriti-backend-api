export const refreshTokenOptions : any = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
};
export const accessTokenOptions : any = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60
};
// Type for user data in the request
export interface UserRequest extends Request {
    user: { _id: string }; // Define the expected shape of req.user
}