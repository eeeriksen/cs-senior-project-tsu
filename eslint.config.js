import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']
    },
    {
        languageOptions: { globals: globals.browser }
    },
    {
        plugins: [
            'react'
        ]
    },
    {
        rules: {
            'no-unused-vars': 'error',
            'quotes': [
                'error',
                'single'
            ],
            'semi': [
                'error',
                'never'
            ],
            'react/react-in-jsx-scope': 0,
            'react/jsx-uses-react': 0,
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
]