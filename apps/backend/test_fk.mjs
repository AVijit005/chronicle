import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.create({ data: { email: 'test5@example.com', username: 'testuser5' } });
  const movie = await prisma.movie.create({ data: { title: 'Test Movie 5', slug: 'test-movie-5' } });
  const collection = await prisma.collection.create({ data: { userId: user.id, name: 'Test Col 5', slug: 'test-col-5' } });
  await prisma.collectionItem.create({ data: { collectionId: collection.id, movieId: movie.id } });
  try {
    await prisma.movie.delete({ where: { id: movie.id } });
    console.log('Deleted movie successfully (THIS IS WRONG if it succeeded)');
  } catch(e) {
    console.log('Delete failed as expected:', e.message);
  }
  await prisma.user.delete({ where: { id: user.id } });
}
run().catch(console.error).finally(() => prisma.$disconnect());
