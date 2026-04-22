import daisyui from 'daisyui';

export default {
    content: [
        './components/**/*.{vue,js,ts}',
        './pages/**/*.{vue,js,ts}',
        './layouts/**/*.{vue,js,ts}',
        './app.vue',
        './plugins/**/*.{js,ts}',
    ],
    plugins: [daisyui],
    daisyui: {
        themes: [
            {
                light: {
                    primary: "#570df8",
                },
            },
            {
                dark: {
                    primary: "#793ef9",
                },
            },
        ],
    },
}
