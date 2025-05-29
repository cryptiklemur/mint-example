import type { Metadata } from "next";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import "../styles/globals.css";
import {AppProps} from 'next/app';
import {useState} from 'react';


export const metadata: Metadata = {
  title: "Frontend App B",
};


export default function App({Component, pageProps}: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <html lang="en">
      <body className="bg-gray-800 dark:bg-gray-200 antialiased p-4">
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
