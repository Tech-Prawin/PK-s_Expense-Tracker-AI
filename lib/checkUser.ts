import { currentUser } from '@clerk/nextjs/server';

import { db } from './db';

/*export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (loggedInUser) {
    return loggedInUser;
  }

  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    },
  });

  return newUser;
};*/


export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;
  const email = user.emailAddresses[0]?.emailAddress ?? `${user.id}@no-email.clerk`;

  try {
    return await db.user.upsert({
      where: { clerkUserId: user.id },
      update: {
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`,
        imageUrl: user.imageUrl,
        email,
      },
      create: {
        clerkUserId: user.id,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`,
        imageUrl: user.imageUrl,
        email,
      },
    });
  } catch (err) {
    // Log and rethrow so callers can handle it or server logs show the failure
    console.error('checkUser upsert error:', err);
    throw err;
  }
};
