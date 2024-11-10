"use client"

import { SessionProvider } from 'next-auth/react';

export default function HomeLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}