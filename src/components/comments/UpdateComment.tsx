import type { Comment, User } from "@prisma/client";
import { type FC, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import TextArea from "../inputs/TextArea";
import { Form, Formik } from "formik";
import Button from "../general/Button";
import * as yup from 'yup';
import { api } from "../../utils/api";
import { toast } from 'react-hot-toast';
import Modal from "../general/Modal";

type UpdateCommentProps = {
    comment: Comment & { author: User | null };
}

const UpdateComment: FC<UpdateCommentProps> = ({ comment }) => {
    
    const [open, setOpen] = useState<boolean>(false);

    const apiUtils = api.useContext();
    const { mutate: updateComment } = api.comments.updateComment.useMutation({
        onMutate: async (values) => {
            await apiUtils.comments.getAllComments.cancel();

            apiUtils.comments.getAllComments.setData(
                { postId: comment.postId }, 
                prev => {
                    if (!prev) return;
                    return prev.map(item => {
                        if (item.id !== comment.id) return item;
                        else return {
                            ...item,
                            text: values.newText,
                        }
                    });
                }
            );
        },
        onSuccess: () => toast.success("Comment updated!"),
        onError: () => toast.error("Could not update comment."),
        onSettled: () => apiUtils.comments.getAllComments.invalidate({ postId: comment.postId }),
    });

    return (
        <Modal
            title="Update Comment"
            open={open}
            onOpenChange={(open) => setOpen(open)}
            trigger={
                <AiFillEdit 
                    className={"fill-sky-500 w-6 h-6 cursor-pointer hover:scale-110 hover:fill-sky-600"} 
                />
            }
        >
            <Formik
                initialValues={{
                    updatedText: comment.text
                }}
                onSubmit={(values) => {
                    console.log("submitting")
                    updateComment({
                        commentId: comment.id,
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
                            label="Update Comment"
                            showLabel={false}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.updatedText}
                            error={props.errors.updatedText}
                            touched={props.touched.updatedText}
                            placeholder="Update Comment"
                        />

                        <Button variant="filled" type="submit">
                            Update Comment
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
};

export default UpdateComment;