import { Form, Formik } from "formik";
import Button from "../general/Button";
import ImageUpload from "../inputs/ImageUpload";
import TextArea from "../inputs/TextArea";
import * as yup from 'yup';
import { api } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

type FormValues = {
    image: File | null;
    postText: string;
}

const CreatePost = () => {

    const router = useRouter();

    const { mutate } = api.posts.createNewPost.useMutation({
        onMutate: () => {
            const toastId = toast.loading("Uploading new post...");

            return { toastId };
        },
        onSuccess: async (_data, _values, ctx) => {
            if (ctx?.toastId) toast.dismiss(ctx.toastId)
            toast.success("Successfully created post!");
            await router.push("/feed");
        },
        onError: (_err, _values, ctx) => {
            if (ctx?.toastId) toast.dismiss(ctx.toastId)
            toast.error("Post could not be created")
        },
    });

    return (
        <Formik
            initialValues={{
                image: null,
                postText: '',
            } as FormValues}
            onSubmit={(values) => {
                const reader = new FileReader();

                if (!values.image) return;
                reader.readAsDataURL(values.image);

                reader.onload = () => {
                    mutate({
                        postText: values.postText,
                        image: reader.result as string,
                    })
                }

                reader.onerror = () => toast.error("Could not upload image");
            }}
            validationSchema={yup.object().shape({
                image: yup.mixed().required("Image is required"),
                postText: yup.string().required("Post text is required."),
            })}
        >
            {(props) => (
                <Form className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow-lg w-5/6 max-w-xl">

                    <ImageUpload onChange={(file) => props.setFieldValue('image', file)} imageValue={props.values.image} />

                    <hr />

                    <TextArea 
                        id="postText"
                        name="postText"
                        required
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.postText}
                        error={props.errors.postText}
                        touched={props.touched.postText}
                        label="Post Text"
                        placeholder="Tell Your Story"
                    />
                    <Button variant="filled" onClick={props.submitForm} >
                        Post
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default CreatePost;