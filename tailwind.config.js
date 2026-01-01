/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Primary - Sage/Teal
                primary: {
                    DEFAULT: '#7A9E9F',
                    light: '#A8C5C6',
                    dark: '#5C7A7B',
                },
                // Secondary - Coral/Peach
                secondary: {
                    DEFAULT: '#E8A87C',
                    light: '#F5D0B5',
                    dark: '#D4956A',
                },
                // Background
                background: {
                    DEFAULT: '#FBF9F7',
                    soft: '#FDF5F0',
                    mint: '#F0F5F5',
                },
                // Surface
                surface: {
                    DEFAULT: '#FFFFFF',
                    muted: '#F5F3F0',
                },
                // Text
                text: {
                    primary: '#3D3D3D',
                    secondary: '#7A7A7A',
                    muted: '#A0A0A0',
                },
                // Border
                border: {
                    DEFAULT: '#E5E2DE',
                    light: '#F0EDEA',
                },
                // Status
                success: '#7A9E7A',
                warning: '#E8C87C',
                error: '#D88A8A',
                // Accent
                accent: {
                    purple: '#C5A8D4',
                    pink: '#F5E6E8',
                },
            },
            fontFamily: {
                sans: ['Inter', 'System'],
            },
            borderRadius: {
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '20px',
            },
        },
    },
    plugins: [],
}