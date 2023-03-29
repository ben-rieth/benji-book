import Button from "../general/Button";
import Modal from "../general/Modal";
import { type FC, useState } from 'react';
import UserCard from "./UserCard";
import { api } from "../../utils/api";
import Loader from "../general/Loader/Loader";

type RelationsBarProps = {
    userId: string;
    followingCount: number;
    followerCount: number;
    requestCount: number | null;
}

const RelationsBar: FC<RelationsBarProps> = ({ userId, followingCount, followerCount, requestCount }) => {

    const [followingOpen, setFollowingOpen] = useState<boolean>(false);
    const { data: following } = api.follows.getFollowing.useQuery({ userId }, { enabled: followingOpen });

    const [followersOpen, setFollowersOpen] = useState<boolean>(false);
    const { data: followers } = api.follows.getFollowers.useQuery({ userId }, { enabled: followersOpen });

    const [requestsOpen, setRequestsOpen] = useState<boolean>(false);
    const { data: requests } = api.follows.getRequests.useQuery({ userId }, { enabled: !!requestCount && requestsOpen });

    return (
        <div className="flex gap-5 w-fit -ml-2">
            <Modal
                trigger={(
                    <Button variant="minimal" >
                        {followingCount} Following
                    </Button>
                )}
                title={`Following`}
                open={followingOpen}
                onOpenChange={setFollowingOpen}
            >
                <div className="h-3/4 overflow-y-auto">
                    {!!following ? following.map(relation => (
                        <UserCard 
                            key={relation.following.id}
                            user={relation.following}
                        />
                    )) : (
                        <Loader />
                    )}
                </div>
            </Modal>
            <Modal
                trigger={(
                    <Button variant="minimal" >
                        {followerCount} Following
                    </Button>
                )}
                title={`Followers`}
                open={followersOpen}
                onOpenChange={setFollowersOpen}
            >
                <div className="h-3/4 overflow-y-auto">
                    {!!followers ? (
                        followers.map(relation => (
                            <UserCard 
                                key={relation.follower.id}
                                user={relation.follower}
                            />
                        ))
                    ) : (
                        <Loader />
                    )}
                </div>
            </Modal>
            {!!requestCount && (
                <Modal
                    trigger={(
                        <Button variant="minimal" >
                            {requestCount} Requests
                        </Button>
                    )}
                    title={`Outstanding Requests`}
                    open={requestsOpen}
                    onOpenChange={setRequestsOpen}
                >
                    <div className="h-3/4 overflow-y-auto">
                        {!!requests ? requests.map(relation => (
                            <UserCard 
                                key={relation.following.id}
                                user={relation.following}
                            />
                        )) : (
                            <Loader />
                        )}
                    </div>
                </Modal>
            )}
        </div>
        
    )
}

export default RelationsBar;