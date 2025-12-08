'use client';

import { setup, tw } from 'twind';

setup({

  theme: {
    extend: {
      colors: {
        // الألوان الأساسية للثيم البنفسجي المستخدم في Dashboard
        primary: '#6b21a8',        // بنفسجي قوي (Header)
        secondary: '#4c1d95',      // بنفسجي داكن (Sidebar)
        accent: '#a855f7',         // بنفسجي فاتح جميل للأزرار
        softPurple: '#ede9fe',     // خلفيات ناعمة
        lightPurple: '#f3e8ff',    // خلفية عامة

        sidebarDark: '#2e1065',    // درجة أغمق للسايدبار
        sidebarLight: '#5b21b6',   // درجة أفتح للسايدبار

        tableHeader: '#f3e8ff',    // هيدر الجدول
        hoverPurple: '#faf5ff',    // صف عند المرور
        
        danger: '#dc2626',         // أحمر للتنبيهات
        success: '#16a34a',        // أخضر
        warning: '#d97706',        // أصفر
      },
    },
  },

  preflight: {
    // ⭐ خلفية الموقع بالكامل — درجات موف خفيفة
    body: {
      backgroundColor: '#f3e8ff',
      color: '#1f1f1f',
      fontFamily: 'system-ui, sans-serif',
    },

    input: {
      color: '#4b0082',
      fontWeight: '600',
    },

    'input::placeholder': {
      color: '#6b21a8',
      opacity: '0.8',
    },

    select: {
      color: '#4b0082',
      fontWeight: '600',
    },

    h1: {
      color: '#4c1d95',
      fontWeight: '700',
    },

    h2: {
      color: '#4c1d95',
      fontWeight: '700',
    },

    label: {
      color: '#4b0082',
      fontWeight: '700',
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
    },

    // ⭐ أزرار عامة
    button: {
      cursor: 'pointer',
      transition: '0.2s ease',
    },
  },
});

export { tw };
