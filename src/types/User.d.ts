import type { User, Post, Follows } from "@prisma/client";

type FullUser = User & {
    status: 'self' | 'accepted';
    posts: Post[];
    followedBy: Follows[];
    following: Follows[];
};

type PrivateUser = {
    id: string;
    status: "pending" | "denied" | null;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
}

export { FullUser, PrivateUser }