import type { User, Post, Comment, Likes } from "@prisma/client";

type FollowCount = {
    _count: {
        followedBy: number;
        following: number;
    }
}

type FollowCountSelf = {
    _count: {
        followedBy: number;
        following: number;
        requests: number;
    }
}

type FullUser = User & {
    status: "ACCEPTED";
    posts: (Post & {comments: Comment[], likedBy: Likes[] })[];
    followedByCurrent: boolean;
} & FollowCount;

type Self = User & {
    likes: Likes[];
    status: 'SELF';
    posts: (Post & {comments: Comment[], likedBy: Likes[] })[];
} & FollowCountSelf;

type PrivateUser = {
    id: string;
    status: "PENDING" | "DENIED" | null;
    statusUpdatedAt: Date | null;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
    imagePlaceholder?: string | null;
    bio?: string | null;
    followedByCurrent: boolean;
} & FollowCount;

export { FullUser, PrivateUser, Self }