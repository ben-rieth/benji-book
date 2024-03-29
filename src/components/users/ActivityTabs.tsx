import * as Tabs from '@radix-ui/react-tabs';
import Link from 'next/link';
import type { FC } from 'react';
import { api } from '../../utils/api';
import Button from '../general/Button';
import Loader from '../general/Loader/Loader';
import LikeCard from '../posts/LikeCard';
import RequestCard from './RequestCard';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BsHeart } from "react-icons/bs";

type ActivityTabProps = {
    defaultTab?: "requests" | "likes";
}

const ActivityTabs: FC<ActivityTabProps> = ({ defaultTab="requests" }) => {

    const { data: requestsData, isSuccess: isRequestsSuccess, isLoading: isRequestsLoading } = api.follows.getReceivedRequests.useQuery();
    const { data: likesData, isSuccess: isLikesSuccess, isLoading: isLikesLoading } = api.users.getLikes.useQuery();

    return (
        <Tabs.Root className="flex flex-col mx-auto px-5" defaultValue={defaultTab}>
                <Tabs.List className="shrink-0 mt-5 flex gap-2 border-b border-black w-full px-2">
                    <Tabs.Trigger asChild value="requests">
                        <div className="flex gap-2 items-center justify-content w-fit bg-white rounded-t-lg px-5 py-2 cursor-pointer data-[state=active]:text-sky-500 data-[state=active]:fill-sky-500">
                            <AiOutlineUserAdd className="w-7 h-7 sm:w-5 sm:h-5"/>
                            <span className="text-base hidden sm:block">
                                Requests
                            </span>
                        </div>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="likes" asChild>
                        <div className="flex gap-2 items-center justify-content w-fit bg-white rounded-t-lg px-5 py-2 cursor-pointer data-[state=active]:text-sky-500 data-[state=active]:fill-sky-500">
                            <BsHeart className="w-7 h-7 sm:w-5 sm:h-5" />
                            <span className="text-base hidden sm:block">
                                Likes
                            </span>
                        </div>
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="requests">
                    <section className="w-full mt-2 max-w-screen-sm mx-auto flex flex-col gap-2">
                        {isRequestsSuccess && requestsData.map(item => (
                            <RequestCard user={item.follower} status={item.status} key={item.follower.id}/>
                        ))}
                        {isRequestsSuccess && requestsData.length === 0 && (
                            <>
                                <p className="text-center">No follow requests right now!</p>
                                <Link href="/users">
                                    <Button variant="minimal">
                                        Search for Users
                                    </Button>
                                </Link>
                            </>
                        )}
                        {isRequestsLoading && (
                            <Loader text="Loading follow requests" />
                        )}
                    </section>
                </Tabs.Content>
                <Tabs.Content value="likes">
                    <section className="w-full mt-2 max-w-screen-sm mx-auto">
                        {isLikesSuccess && likesData.map(like => (
                            <LikeCard 
                                key={`${like.post.id}-${like.user.id}`}
                                postId={like.post.id}
                                postImage={like.post.image}
                                postPlaceholder={like.post.placeholder}
                                createdAt={like.createdAt}
                                username={like.user.username}
                                userId={like.user.id}
                            />
                        ))}
                        {isLikesSuccess && likesData.length === 0 && (
                            <>
                                <p className="text-center">No likes yet.</p>
                                <Link href="/posts/create">
                                    <Button variant="minimal">
                                        Create a New Post
                                    </Button>
                                </Link>
                            </>
                        )}
                        {isLikesLoading && (
                            <Loader text="Loading recent likes on your posts" />
                        )}
                    </section>
                </Tabs.Content>
            </Tabs.Root>
    )
}

export default ActivityTabs;