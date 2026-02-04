'use client'; // Սա պարտադիր է, քանի որ Provider-ը աշխատում է բրաուզերում

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Մենք ստեղծում ենք QueryClient-ը useState-ի մեջ, 
  // որպեսզի Next.js-ը ամեն թարմացման ժամանակ նորը չարտադրի
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Այս Devtools-ը կօգնի մեզ տեսնել, թե ինչ է կատարվում քեշի մեջ */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}