"use client";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import React from "react";
import { tw } from "./twind";

type Props = {
  children: React.ReactNode;
};

// ستايل موف غامق لجميع الأزرار
export const buttonClass = tw`bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-900 transition-colors`;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ar">
      <body
        className={tw`bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-gray-100 min-h-screen`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
