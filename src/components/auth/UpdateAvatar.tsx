import { Form, Formik } from "formik";
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
}

type FormValues = {
    image: null | File
}

const UpdateAvatar: FC<UpdateAvatarProps> = ({ avatar, userId }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [initialImage, setInitialImage] = useState<File | null>(null);

    let uploadImageToastId: string | undefined;

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
        onError: () => {
            toast.dismiss(uploadImageToastId);
            toast.error("Could not update profile picture")
        },
        onSuccess: () =>{
            toast.dismiss(uploadImageToastId);
            toast.success("Profile picture updated!")
        },
        onSettled: () => apiUtils.users.getOneUser.invalidate({ userId }),
    });

    return (
        <Modal
            title="Update Your Avatar"
            open={modalOpen}
            onOpenChange={(open) => setModalOpen(open)}
            trigger={<EditIcon />}
        >
            <Formik
                initialValues={{
                    image: initialImage
                } as FormValues}
                onSubmit={(values) => {
                    uploadImageToastId = toast.loading("Uploading new profile pic...")
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
                        
                        <Button type="submit">
                            Update Avatar
                        </Button>
                    </Form>
                )}
            </Formik>
            
        </Modal>
    )
}

export default UpdateAvatar;