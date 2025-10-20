'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { memo } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { useUserStore } from '@/store/user';
import { LobeUser } from '@/types/user';

// update the user data into the context
const UserUpdater = memo(() => {
  const { isLoaded, user, isSignedIn } = useUser();

  const { session, openUserProfile, signOut, openSignIn } = useClerk();

  const useStoreUpdater = createStoreUpdater(useUserStore);

  const lobeUser: LobeUser | undefined = user
    ? {
        avatar: user.imageUrl,
        firstName: user.firstName,
        fullName: user.fullName,
        id: user.id,
        latestName: user.lastName,
        username: user.username,
      }
    : undefined;

  useStoreUpdater('isLoaded', isLoaded);
  useStoreUpdater('user', lobeUser);
  useStoreUpdater('isSignedIn', isSignedIn);

  const activeSession = session?.status === 'active' ? session : undefined;

  useStoreUpdater('clerkUser', user ?? undefined);
  useStoreUpdater('clerkSession', activeSession);
  useStoreUpdater('clerkSignIn', openSignIn);
  useStoreUpdater('clerkOpenUserProfile', openUserProfile);
  useStoreUpdater('clerkSignOut', signOut);

  return null;
});

export default UserUpdater;
