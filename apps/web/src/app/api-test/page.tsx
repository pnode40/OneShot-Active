'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function APITestPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">API Test Page</h1>
      <p>This is just a placeholder. Page is now working ✅</p>
    </main>
  );
}