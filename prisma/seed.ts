import { 
    randAvatar, 
    randFirstName, 
    randLastName, 
    randUserName, 
    rand, 
    randPastDate, 
    randEmail, 
    randRecentDate, 
    randSentence, 
    randImg 
} from "@ngneat/falso";
import { prisma } from "./../src/server/db";

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)] as T;
}

async function seed() {
    await prisma.user.deleteMany({
        where: {
            NOT: [
                { id: 'cleq4fpmv0000uh7knb23h18r' }
            ]
        }
    });

    const userIds: string[] = [];

    // create users
    for (let i = 0; i < 100; i++) {

        const [first, last] = [randFirstName(), randLastName()]

        const { id } = await prisma.user.create({
            data: {
                setData: true,
                firstName: first,
                lastName: last,
                username: randUserName({ firstName: first, lastName: last }).toLowerCase(),
                image: randAvatar(),
                gender: rand(['male', 'female', 'transgender', 'non-binary', 'agender', 'other']),
                birthday: randPastDate({ years: 60 }),
                email: randEmail(),
                emailVerified: randRecentDate(),
                bio: randSentence(),
            }
        });

        userIds.push(id);
    }

    // add followers
    // await Promise.all(userIds.map(async(user) => {
    for (const user of userIds) {
        const follows: string[] = [];

        for (let j = 0; j < 7; j++) {
            const random = getRandomItem(userIds);

            if (random === user || follows.includes(random)) continue;

            await prisma.follows.create({
                data: {
                    followerId: user,
                    followingId: random,
                    status: 'accepted',
                },
            });

            follows.push(random);
        }

        for (let j = 0; j < 6; j++) {
            await prisma.post.create({
                data: {
                    authorId: user,
                    text: randSentence(),
                    image: randImg(),
                    comments: {
                        create: [
                            { text: randSentence(), authorId: getRandomItem(follows) },
                            { text: randSentence(), authorId: getRandomItem(follows) },
                            { text: randSentence(), authorId: getRandomItem(follows) },
                            { text: randSentence(), authorId: getRandomItem(follows) },
                            { text: randSentence(), authorId: getRandomItem(follows) },
                            { text: randSentence(), authorId: getRandomItem(follows) },
                        ]
                    },
                    // likes: {
                    //     create: [
                    //         { userId: follows[0] as string }
                    //     ],
                    // }
                }
            });
        }
    // }));
    }

        

}

seed()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })