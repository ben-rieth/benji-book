import type { Post, User, Likes } from "@prisma/client";
import { type FC, useState } from "react";
import TextArea from "../inputs/TextArea";
import { Form, Formik } from "formik";
import Button from "../general/Button";
import * as yup from 'yup';
import { api } from "../../utils/api";
import { toast } from 'react-hot-toast';
import Modal from "../general/Modal";
import { EditIcon } from "../general/icons";

type UpdatePostProps = {
    post: Post & {
        author: User;
        likedBy: Likes[];
    }
}

const UpdatePost: FC<UpdatePostProps> = ({ post }) => {
    
    const [open, setOpen] = useState<boolean>(false);

    const apiUtils = api.useContext();
    const { mutate: updatePost } = api.posts.updatePost.useMutation({
        onMutate: async () => {
            await apiUtils.posts.getPost.cancel();
            await apiUtils.posts.getAllPosts.cancel();
        },
        onSuccess: () => toast.success("Post text updated!"),
        onError: () => toast.error("Could not update post text."),
        onSettled: async () => {
            await apiUtils.posts.getPost.invalidate({ postId: post.id });
            await apiUtils.posts.getAllPosts.invalidate();
        },
    });

    return (
        <Modal
            title="Update Post"
            open={open}
            onOpenChange={(open) => setOpen(open)}
            trigger={<EditIcon />}
        >
            <Formik
                initialValues={{
                    updatedText: post.text
                }}
                onSubmit={(values) => {
                    updatePost({
                        postId: post.id,
                        newText: values.updatedText,
                    });
                    setOpen(false);
                }}
                validationSchema={yup.object().shape({
                    updatedText: yup.string().required("Comment must have text content.")
                })}
            >
                {(props) => (
                    <Form className="flex flex-col gap-5">
                        <TextArea 
                            id="updatedText"
                            name="updatedText"
                            label="Update Post Text"
                            showLabel={false}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.updatedText}
                            error={props.errors.updatedText}
                            touched={props.touched.updatedText}
                            placeholder="Update Post Text"
                        />

                        <Button variant="filled" type="submit" >
                            Update Post Text
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
};

export default UpdatePost;