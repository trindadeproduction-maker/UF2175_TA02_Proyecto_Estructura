/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#6D5EF5",
                secondary: "#8B7BFF",
                success: "#22C55E",
                warning: "#F59E0B",
                danger: "#EF4444",
                background: "#F8FAFC"
            },
            borderRadius: {
                sm: "8px",
                md: "12px",
                lg: "16px"
            }
        }
    },
    plugins: []
};