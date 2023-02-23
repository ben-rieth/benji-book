import * as yup from 'yup';
import TextInput from "../inputs/TextInput";
import Button from "../buttons/Button";
import { Form, Formik } from 'formik';
import { MdOutlineMail } from 'react-icons/md';

const SignInForm = () => {
    return (
        <Formik
            initialValues={{
                email: '',
            }}
            onSubmit={(values) => {
                console.log(values)
            }}
            validationSchema={yup.object().shape({
                email: yup.string().email('Invalid email').required("Email is required")
            })}
            validateOnBlur
        >
            {props => (
                <Form>
                    <TextInput 
                        id="email"
                        name="email"
                        placeholder="email@example.com"
                        label="Email"
                        type="email"
                        required={true}
                        value={props.values.email}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={props.errors.email}
                        touched={props.touched.email}
                        leftIcon={
                            <MdOutlineMail 
                                className={props.errors.email && props.touched.email ? "fill-red-500" : "fill-black"} />
                        }
                    />
                    <Button type="submit" variant="filled">
                        Sign In
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default SignInForm;