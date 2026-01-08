"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function AuthSync() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // When Clerk client detects a signed-in user, refresh the server-rendered page
    // so server components (which use `currentUser()`) will re-run and render auth UI.
    if (isLoaded && isSignedIn) {
      router.refresh();
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
}
