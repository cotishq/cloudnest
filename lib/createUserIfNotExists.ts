
import { db } from "@/lib/db";

export async function createUserIfNotExists(userId: string) {
  const userExists = await db.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    
    await db.user.create({
      data: {
        id: userId,
        email: `${userId}@example.com`, 
      },
    });
  }
}
