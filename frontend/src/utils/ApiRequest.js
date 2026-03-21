const host = process.env.REACT_APP_BACKEND_URL;

export const registerAPI = `${host}/api/auth/register`;
export const loginAPI = `${host}/api/auth/login`;