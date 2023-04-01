import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env.mjs";
import { prisma } from "../../../server/db";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

const ARRAY_CHUNK_SIZE = 98;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // const auth = req.query.key as string;

    // if (auth !== env.CRON_KEY) {
    //     return res.status(403).json({
    //         message: "Not authorized to run this function."
    //     });
    // }

    let users, posts;

    try {

        [posts, users] = await Promise.all([
            prisma.post.findMany({
                where: {
                    author: { maintain: false }
                }
            }),
            prisma.user.findMany({
                where: { maintain: false }
            })
        ]);
    } catch (_err) {
        return res.status(500).json({
            message: "Cannot get users or posts from prisma."
        })
    }

    for (let i = 0; i < posts.length; i+=ARRAY_CHUNK_SIZE) {
        const current = posts.slice(i, i+ARRAY_CHUNK_SIZE);
        const currentIds = current.map(post => post.id);

        await cloudinary.api.delete_resources(currentIds);
    }

    for (let i = 0; i < users.length; i+=ARRAY_CHUNK_SIZE) {
        const current = users.slice(i, i+ARRAY_CHUNK_SIZE);
        const currentIds = current.map(user => `${user.id}-avatar`);

        await cloudinary.api.delete_resources(currentIds);
    }

    try {
        const { count } = await prisma.user.deleteMany({
            where: { maintain: false }
        });

        return res.status(200).json({
            message: `${count} users deleted from database`
        });
    } catch (_err) {
        return res.status(500).json({
            message: "Could not delete users from database. (Cloudinary posts have already been deleted)"
        })
    }

}

export default handler;