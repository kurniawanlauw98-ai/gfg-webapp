/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6', // Blue-500
                secondary: '#EF4444', // Red-500
                dark: '#1F2937', // Gray-800
            }
        },
    },
    plugins: [],
}
