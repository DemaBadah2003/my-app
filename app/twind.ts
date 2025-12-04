'use client';

import { setup, tw } from 'twind';

setup({
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',

        // ⭐ موف فاتح جداً – للخلفية
        lightPurple: '#f3e8ff',
      },
    },
  },

  preflight: {
    // ⭐ خلفية موف فاتح لكل الموقع
    body: {
      backgroundColor: '#f3e8ff',
    },

    // input
    input: {
      color: '#4b0082',
      fontWeight: '600',
    },

    // placeholder
    'input::placeholder': {
      color: '#4b0082',
      opacity: '1',
    },

    // select
    select: {
      color: '#4b0082',
      fontWeight: '600',
    },

    // العنوان
    h2: {
      color: '#4b0082',
      fontWeight: '700',
    },

    // ⭐ label ـ الآن بنفس قوة ووضوح العنوان
    label: {
      color: '#4b0082',
      fontWeight: '700',
      fontSize: '1.125rem',   // ← نفس حجم text-lg
      lineHeight: '1.75rem',
    },
  },
});

export { tw };
