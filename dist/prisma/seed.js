const { PrismaClient } = require('./generated/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
async function main() {
    try {
        // Create or update tags
        console.log('Creating tags...');
        const tagNames = [
            'Technology',
            'Programming',
            'Web Development',
            'AI',
            'JavaScript',
            'Python',
            'Database',
        ];
        const tags = await Promise.all(tagNames.map((name) => prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        })));
        console.log('Tags created');
        // Create or update users
        console.log('Creating users...');
        const users = await Promise.all(Array.from({ length: 5 }, async (_, i) => {
            const email = `user${i + 1}@example.com`;
            return prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    password: await bcrypt.hash('password123', 10),
                    name: `User ${i + 1}`,
                    bio: `Bio for user ${i + 1}`,
                    role: i === 0 ? 'admin' : 'user',
                    avatarUrl: `https://i.pravatar.cc/150?u=${i + 1}`,
                },
            });
        }));
        console.log('Users created');
        // Create 2-5 posts for each user
        console.log('Creating posts, comments, and likes...');
        for (const user of users) {
            const numPosts = Math.floor(Math.random() * 4) + 2; // 2-5 posts
            for (let i = 0; i < numPosts; i++) {
                const post = await prisma.post.create({
                    data: {
                        title: `Post ${i + 1} by ${user.name}`,
                        content: `This is the content of post ${i + 1} by ${user.name}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
                        authorId: user.id,
                        status: ['draft', 'published', 'published', 'published'][Math.floor(Math.random() * 4)],
                        postTags: {
                            create: Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 3) + 1 }, // 1-3 unique tags per post
                            () => Math.floor(Math.random() * tags.length)))).map((tagIndex) => ({
                                tagId: tags[tagIndex].id,
                            })),
                        },
                    },
                });
                // Create 1-3 top-level comments for each post
                const numComments = Math.floor(Math.random() * 3) + 1;
                for (let j = 0; j < numComments; j++) {
                    const comment = await prisma.comment.create({
                        data: {
                            content: `Main comment ${j + 1} on post ${post.id}`,
                            postId: post.id,
                            authorId: users[Math.floor(Math.random() * users.length)].id,
                            status: 'approved',
                        },
                    });
                    // Create 0-2 nested comments (replies) for each comment
                    const numReplies = Math.floor(Math.random() * 3);
                    for (let k = 0; k < numReplies; k++) {
                        await prisma.comment.create({
                            data: {
                                content: `Reply ${k + 1} to comment ${comment.id}`,
                                postId: post.id,
                                authorId: users[Math.floor(Math.random() * users.length)].id,
                                parentCommentId: comment.id,
                                status: 'approved',
                            },
                        });
                    }
                }
                // Create likes for posts (1-3 likes per post)
                const numLikes = Math.floor(Math.random() * 3) + 1;
                const likedUsers = new Set();
                for (let j = 0; j < numLikes; j++) {
                    let randomUserId;
                    do {
                        randomUserId = users[Math.floor(Math.random() * users.length)].id;
                    } while (likedUsers.has(randomUserId));
                    likedUsers.add(randomUserId);
                    await prisma.like.create({
                        data: {
                            userId: randomUserId,
                            postId: post.id,
                        },
                    });
                }
            }
        }
        console.log('Posts, comments, and likes created');
        // Create some subscriptions
        console.log('Creating subscriptions...');
        await Promise.all([
            prisma.subscription.create({
                data: {
                    email: 'subscriber1@example.com',
                    userId: users[0].id,
                },
            }),
            prisma.subscription.create({
                data: {
                    email: 'subscriber2@example.com',
                },
            }),
        ]);
        console.log('Subscriptions created');
        console.log('✅ Seed data created successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
export {};
