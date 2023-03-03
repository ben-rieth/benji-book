import { randAvatar, randFirstName, randLastName, randUserName, rand, randPastDate, randEmail, randRecentDate, randSentence } from "@ngneat/falso";
import { prisma } from "./../src/server/db";

async function seed() {
    await prisma.user.deleteMany({
        where: {
            NOT: [
                { id: 'cleq4fpmv0000uh7knb23h18r' }
            ]
        }
    });

    for (let i = 0; i < 100; i++) {

        const [first, last] = [randFirstName(), randLastName()]

        await prisma.user.create({
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
        })
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