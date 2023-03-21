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
    status: 'accepted';
    posts: (Post & {comments: Comment[], likedBy: Likes[] })[];
} & FollowCount;

type Self = User & {
    likes: Likes[];
    status: 'self';
    posts: (Post & {comments: Comment[], likedBy: Likes[] })[];
} & FollowCountSelf;

type PrivateUser = {
    id: string;
    status: "pending" | "denied" | null;
    statusUpdatedAt: Date | null;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
    bio?: string | null;
} & FollowCount;

export { FullUser, PrivateUser, Self }