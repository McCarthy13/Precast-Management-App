import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard on initial load
    router.push('/dashboard');
  }, [router]);
  
  return null; // No need to render anything as we're redirecting
}
