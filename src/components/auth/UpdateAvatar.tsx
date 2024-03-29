import { Form, Formik } from "formik";
import type { ReactNode } from "react";
import { type FC, useState, useEffect } from "react";
import Button from "../general/Button";
import Modal from "../general/Modal";
import ImageUpload from "../inputs/ImageUpload";
import * as yup from 'yup';
import { EditIcon } from "../general/icons";
import { api } from "../../utils/api";
import { toast } from "react-hot-toast";

type UpdateAvatarProps = {
    userId: string;
    avatar: string | null | undefined;
    trigger?: ReactNode;
}

type FormValues = {
    image: null | File
}

const UpdateAvatar: FC<UpdateAvatarProps> = ({ avatar, userId, trigger }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [initialImage, setInitialImage] = useState<File | null>(null);

    useEffect(() => {
        if (avatar) {
            fetch(avatar)
                .then(res => res.blob())
                .then(blob => setInitialImage(new File([blob], 'initial')))
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .catch(_err => console.log("Error"))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const apiUtils = api.useContext();
    const { mutateAsync: updateAvatar } = api.users.updateAvatar.useMutation({
        onMutate: () => {
            const toastId = toast.loading('Uploading new profile pic...');

            return { toastId };
        },
        onError: (_err, _values, ctx) => {
            if (ctx?.toastId) toast.dismiss(ctx.toastId);
            toast.error("Could not update profile picture")
        },
        onSuccess: (_data, _values, ctx) =>{
            if (ctx?.toastId) toast.dismiss(ctx.toastId);
            toast.success("Profile picture updated!")
        },
        onSettled: () => apiUtils.users.getOneUser.invalidate({ userId }),
    });

    return (
        <Modal
            title="Update Your Avatar"
            open={modalOpen}
            onOpenChange={(open) => setModalOpen(open)}
            trigger={trigger ? trigger : <EditIcon />}
        >
            <Formik
                initialValues={{
                    image: initialImage
                } as FormValues}
                onSubmit={(values) => {
                    const reader = new FileReader();

                    if (!values.image) return;
                    reader.readAsDataURL(values.image);

                    reader.onload = async() => {
                        await updateAvatar({
                            userId,
                            image: reader.result as string,
                        });
                        setModalOpen(false);
                    }

                    reader.onerror = () => {
                        toast.error("Could not upload image");
                        setModalOpen(false);
                    };
                } }
                validationSchema={yup.object().shape({
                    image: yup.mixed()
                })}
            >
                {(props) => (
                    <Form>
                        <ImageUpload 
                            imageValue={props.values.image}
                            onChange={(file) => props.setFieldValue('image', file)} 
                            rounded 
                        />
                        
                        <hr className="my-5" />
                        
                        <Button type="submit" onClick={() => props.submitForm()}>
                            Update Avatar
                        </Button>
                    </Form>
                )}
            </Formik>
            
        </Modal>
    )
}

export default UpdateAvatar;