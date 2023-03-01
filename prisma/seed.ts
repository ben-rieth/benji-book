import { randAvatar, randFirstName, randLastName, randUserName, rand, randPastDate, randEmail, randRecentDate } from "@ngneat/falso";
import { prisma } from "./../src/server/db";

async function seed() {
    await prisma.user.deleteMany({});

    for (let i = 0; i <5; i++) {
        await prisma.user.create({
            data: {
                setData: true,
                firstName: randFirstName(),
                lastName: randLastName(),
                username: randUserName().toLowerCase(),
                image: randAvatar(),
                gender: rand(['male', 'female', 'transgender', 'non-binary', 'agender', 'other']),
                birthday: randPastDate({ years: 60 }),
                email: randEmail(),
                emailVerified: randRecentDate(),
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