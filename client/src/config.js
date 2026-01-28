export const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_API_URL || 'https://gfg-webapp-6aplbcn86-daddys-projects-787ed0d2.vercel.app';
