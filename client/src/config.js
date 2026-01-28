export const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_API_URL || 'https://gfg-becken.vercel.app';
