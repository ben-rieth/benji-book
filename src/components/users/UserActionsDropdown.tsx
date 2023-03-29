import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import classNames from 'classnames';
import { GoKebabVertical } from 'react-icons/go';
import { api } from '../../utils/api';
import DangerButton from '../general/DangerButton';
import { toast } from "react-hot-toast";
import { type FC } from 'react';

type UserActionDropdownProps = {
    pageUserId: string;
    currentUserId: string;
    showUnfollow: boolean;
    showRemoveFollower: boolean;
}

const UserActionDropdown: FC<UserActionDropdownProps> = ({ pageUserId, currentUserId, showUnfollow, showRemoveFollower }) => {

    const apiUtils = api.useContext();

    const { mutate: removeFollowRequest } = api.follows.deleteFollowRequest.useMutation({
        onMutate: async () => {
            await apiUtils.users.getOneUser.cancel();
        },
        onError: () => toast.error("Could not remove request at this time."),
        onSuccess: () => toast.success("Follow request removed!"),
        onSettled: async () => {
            await apiUtils.users.getOneUser.invalidate({ userId: pageUserId })
        },
    });

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <GoKebabVertical className="w-5 h-5" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content sideOffset={10} className="bg-white py-2 px-5 w-76 rounded-lg shadow-2xl flex flex-col">
                    <DropdownMenu.Arrow className="fill-white" />

                    <DropdownMenu.Item className={classNames({ "hidden": showUnfollow })}>
                        <DangerButton
                            alertTitle="Are you sure?"
                            alertDescription="If you want to follow this person again in the future, you will have to send another request."
                            alertActionLabel="Unfollow"
                            variant="minimal"
                            onClick={() => removeFollowRequest({ followerId: currentUserId, followingId: pageUserId })}
                        >
                            Unfollow
                        </DangerButton>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className={classNames({ "hidden": showRemoveFollower })}>
                        <DangerButton
                            alertTitle="Are you sure?"
                            alertDescription="This person will be able to send follow requests in the future."
                            alertActionLabel="Remove Follower"
                            variant="minimal"
                            onClick={() => removeFollowRequest({ followerId: pageUserId, followingId: currentUserId })}
                        >
                            Remove Follower
                        </DangerButton>
                    </DropdownMenu.Item>

                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}

export default UserActionDropdown;