import { randAvatar, randFirstName, randLastName, randUserName, rand, randPastDate, randEmail, randRecentDate, randSentence, randPhrase, randImg } from "@ngneat/falso";
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
                // posts: {
                //     create: [
                //         { text: randPhrase(), image: randImg(), },
                //         { text: randPhrase(), image: randImg(), },
                //         { text: randPhrase(), image: randImg(), },
                //         { text: randPhrase(), image: randImg(), },
                //         { text: randPhrase(), image: randImg(), },
                //         { text: randPhrase(), image: randImg(), },
                //     ]
                // }
            }
        });

        userIds.push(id);
    }

    // add followers
    for( let i = 0; i < 100; i++) {
        const follows: string[] = [];

        for (let j = 0; j < 7; j++) {
            const random = getRandomItem(userIds);

            if (random === userIds[i] || follows.includes(random)) continue;

            follows.push(random);

            await prisma.follows.create({
                data: {
                    followerId: userIds[i] as string,
                    followingId: random,
                    status: 'accepted',
                },
            });
        }
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