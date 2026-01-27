export const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_API_URL || 'https://gfg-server-vercel-placeholder.vercel.app'; // User needs to update this after deploying backend
