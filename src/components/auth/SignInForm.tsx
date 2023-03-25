import * as yup from 'yup';
import TextInput from "../inputs/TextInput";
import Button from "../general/Button";
import { Form, Formik } from 'formik';
import { MdOutlineMail } from 'react-icons/md';
import { AiOutlineLoading } from 'react-icons/ai';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import WhyNoPassword from './WhyNoPassword';
import ErrorBox from '../error/ErrorBox';
import { useState } from 'react';

const SignInForm = () => {

    const router = useRouter();
    const [error, setError] = useState<string>(router.query['error'] as string);
    const [confirm, setConfirm] = useState<boolean>(false);

    return (
        <Formik
            initialValues={{
                email: '',
            }}
            onSubmit={async (values) => {
                const result = await signIn("email", { email: values.email, redirect: false });
                
                if (result && result.error) {
                    console.log(result.error)
                    setError(result.error)
                    return;
                }

                setConfirm(true);
            }}
            validationSchema={yup.object().shape({
                email: yup.string().email('Invalid email').required("Email is required")
            })}
            validateOnBlur
        >
            {props => {
                if (!confirm) return (
                    <Form className="flex flex-col bg-white p-5 rounded-xl">
                        {error && <ErrorBox message={error} />}
                        <h1 className="text-center text-sky-500 text-2xl font-semibold">Sign In</h1>
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
                        <div className="h-4"/>

                        <Button type="submit" variant="filled">
                            {props.isSubmitting ? (
                                <AiOutlineLoading className="animate-spin" />     
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <div className="h-4"/>

                        <WhyNoPassword />

                    </Form>
                );

                return (
                    <div className="flex flex-col gap-4 bg-white p-8 rounded-xl">
                        <p className="text-sky-500 text-center">Go to {props.values.email} to finish signing in!</p>
                    </div>
                );
            }}
        </Formik>
    )
}

export default SignInForm;