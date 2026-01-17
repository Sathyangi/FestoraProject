import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
        fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
        },
        },
    },

    plugins: [forms],
};
