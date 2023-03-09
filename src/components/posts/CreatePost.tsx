import { Form, Formik } from "formik";
import Button from "../general/Button";
import ImageUpload from "../inputs/ImageUpload";
import TextArea from "../inputs/TextArea";
import * as yup from 'yup';

type FormValues = {
    image: File | null;
    postText: string;
}

const CreatePost = () => {
    return (
        <Formik
            initialValues={{
                image: null,
                postText: '',
            } as FormValues}
            onSubmit={(values) => console.log(values)}
            validationSchema={yup.object().shape({
                image: yup.mixed().required("Image is required"),
                postText: yup.string().required("Post text is required."),
            })}
        >
            {(props) => (
                <Form className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow-lg w-5/6 max-w-xl">

                    <ImageUpload onChange={(file) => props.setFieldValue('image', file)} />

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
                    <Button variant="filled" type="submit">
                        Post
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default CreatePost;