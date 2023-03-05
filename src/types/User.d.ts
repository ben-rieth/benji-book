import type { User, Post, Follows, Comment, Likes } from "@prisma/client";

type FullUser = User & {
    status: 'accepted';
    posts: (Post & {comments: Comment[], likedBy: Likes[] })[];
    followedBy: Follows[];
    following: Follows[];
};

type Self = User & {
    likes: Likes[];
    status: 'self';
    posts: (Post & {comments: Comment[], likedBy: Likes[] })[];
    followedBy: Follows[];
    following: Follows[];
}

type PrivateUser = {
    id: string;
    status: "pending" | "denied" | null;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
    bio?: string | null;
}

export { FullUser, PrivateUser, Self }