import type { User, Post, Follows } from "@prisma/client";

type FullUser = User & {
    posts: Post[];
    followedBy: Follows[];
    following: Follows[];
};

export { FullUser }