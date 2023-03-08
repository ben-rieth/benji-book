import type { Comment, User } from "@prisma/client";
import { type FC, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";
import classNames from "classnames";
import TextArea from "../inputs/TextArea";
import { Form, Formik } from "formik";
import Button from "../general/Button";
import * as yup from 'yup';
import { api } from "../../utils/api";
import { toast } from 'react-hot-toast';

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
        <Dialog.Root
            open={open} 
            onOpenChange={(open) => setOpen(open)}
        >
            <Dialog.Trigger asChild>
                <AiFillEdit 
                    className={"fill-sky-500 w-6 h-6 cursor-pointer hover:scale-110 hover:fill-sky-600"} 
                />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content 
                    className={classNames(
                        "data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[550px] translate-x-[-50%] translate-y-[-50%]",
                        "bg-white rounded-lg shadow-lg focus:outline-none p-7"
                    )
                }>
                    <Dialog.Title className="font-semibold text-xl text-sky-500">Update Comment</Dialog.Title>

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

                    <Dialog.Close asChild>
                        <AiOutlineClose
                            className="fill-red-500 absolute top-5 right-5 w-7 h-7 cursor-pointer hover:fill-red-600 active:bg-red-300 rounded-full p-1"
                        />
                    </Dialog.Close>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
};

export default UpdateComment;