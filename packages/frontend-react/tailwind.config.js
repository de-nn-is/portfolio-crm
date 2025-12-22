/** @type {import('tailwindcss').Config} */
import sharedPreset from '@crm/shared-utils/tailwind.preset.js';

export default {
  presets: [sharedPreset],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
};
