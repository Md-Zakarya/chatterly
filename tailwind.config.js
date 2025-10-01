import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                mono: {
                    bg: "#0a0a0a", // page background
                    card: "#111111", // card background
                    fg: "#fafafa", // primary foreground
                    muted: "#bfbfbf",
                    border: "#1f1f1f",
                    subtle: "#eaeaea",
                },
            },
            fontFamily: {
                display: [
                    'Bricolage Grotesque',
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica',
                    'Arial',
                    'Noto Sans',
                    'sans-serif',
                ],
                mono: [
                    'IBM Plex Mono',
                    'ui-monospace',
                    'SFMono-Regular',
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    'Liberation Mono',
                    'Courier New',
                    'monospace',
                ],
            },
            boxShadow: {
                "mono": "0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.5)",
            },
            borderRadius: {
                xl: '1rem',
            },
        },
    },
    plugins: [
        typography,
    ],
}

