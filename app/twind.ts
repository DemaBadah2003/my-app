'use client';

import { setup, tw } from 'twind';

setup({
  theme: {
    extend: {
      colors: {
        primary: '#6b21a8',
        secondary: '#4c1d95',
        accent: '#a855f7',
        softPurple: '#ede9fe',
        lightPurple: '#f3e8ff',
        sidebarDark: '#2e1065',
        sidebarLight: '#5b21b6',
        tableHeader: '#f3e8ff',
        hoverPurple: '#faf5ff',
        danger: '#dc2626',
        success: '#16a34a',
        warning: '#d97706',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },

  preflight: {
    body: {
      backgroundColor: '#f3e8ff',
      color: '#1f1f1f',
      fontFamily: 'system-ui, sans-serif',
    },

    input: { color: '#4b0082', fontWeight: '600' },
    'input::placeholder': { color: '#6b21a8', opacity: '0.8' },
    select: { color: '#4b0082', fontWeight: '600' },
    h1: { color: '#4c1d95', fontWeight: '700' },
    h2: { color: '#4c1d95', fontWeight: '700' },
    label: { color: '#4b0082', fontWeight: '700', fontSize: '1.125rem', lineHeight: '1.75rem' },
    button: { cursor: 'pointer', transition: '0.2s ease' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '0.75rem', backgroundColor: '#f3e8ff' },
    td: { padding: '0.75rem' },

    '@media (max-width: 480px)': {
      '.mobile-table td, .mobile-table th': { padding: '6px !important', fontSize: '12px !important' },
      '.mobile-table': { minWidth: '100% !important' },
      '.control-panel input, .control-panel select, .control-panel button': { fontSize: '14px !important', padding: '8px !important' },
      '.flex-wrap-on-mobile': { flexWrap: 'wrap !important' },
    },

    '.header': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '4rem',
      backgroundColor: '#ffffffcc',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      padding: '0 1rem',
      zIndex: '50',
    },
    '.header-title': { fontSize: '1.25rem', fontWeight: '600', color: '#4c1d95', textAlign: 'center', flexGrow: '1' },
    '.header-left': { zIndex: '60' },
    '.header-right': { display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: '60' },

    '.table-actions button': { minWidth: '36px', minHeight: '36px', textAlign: 'center' },

    // Mobile ellipsis menu for users table
    '.mobile-ellipsis-button': { padding: '6px', borderRadius: '4px', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    '.mobile-ellipsis-menu': {
      position: 'absolute',
      right: 0,
      marginTop: '4px',
      backgroundColor: '#ffffff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: '100',
      minWidth: '140px',
    },
    '.mobile-ellipsis-menu button': {
      padding: '8px 12px',
      textAlign: 'left',
      width: '100%',
      backgroundColor: 'transparent',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: '0.2s ease',
    },
    '.mobile-ellipsis-menu button:hover': { backgroundColor: '#f3e8ff' },

    // Actions buttons styles
    '.action-edit': { color: '#4c1d95', backgroundColor: 'transparent', border: '1px solid #4c1d95', borderRadius: '4px', padding: '4px 8px' },
    '.action-delete': { color: '#dc2626', backgroundColor: 'transparent', border: '1px solid #dc2626', borderRadius: '4px', padding: '4px 8px' },
    '.action-view': { color: '#16a34a', backgroundColor: 'transparent', border: '1px solid #16a34a', borderRadius: '4px', padding: '4px 8px' },
  },
});

export { tw };
