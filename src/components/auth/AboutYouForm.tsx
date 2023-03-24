import type { FormikProps} from "formik";
import { Form, Formik } from "formik";
import * as yup from 'yup';
import TextInput from "../inputs/TextInput";
import Button from "../general/Button";
import SelectInput from "../inputs/SelectInput";
import 'node_modules/react-datepicker/dist/react-datepicker.min.css'
import DateInput from "../inputs/DateInput";
import { rand, randUser, randPastDate } from "@ngneat/falso";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { isToday } from "date-fns";
import { AiOutlineLoading } from "react-icons/ai";
import { useState } from "react";
import ErrorBox from "../error/ErrorBox";

type FormValues = {
    firstName: string;
    lastName: string;
    username: string;
    birthday: Date;
    gender: 'male' | 'female' | 'transgender' | 'agender' | 'non-binary' | 'other' | undefined;
}

const AboutYouForm = () => {
    const generateRandomData = (props: FormikProps<FormValues>) => {
        const fakeUser = randUser();

        props.setFieldValue('firstName', fakeUser.firstName);
        props.setFieldValue('lastName', fakeUser.lastName);
        props.setFieldValue('username', fakeUser.username.toLowerCase());
        props.setFieldValue('gender', rand(['male', 'female', 'transgender', 'non-binary', 'agender', 'other']));
        props.setFieldValue('birthday', randPastDate({ years: 10 }))
    }

    const [serverError, setServerError] = useState<string | undefined>();

    const { mutateAsync: updateAccount } = api.users.updateAccount.useMutation({
        onError: (error) => {
            setServerError(error.message);
        }
    });
    const router = useRouter();

    const initialValues: FormValues = {
        firstName: '',
        lastName: '',
        username: '',
        birthday: new Date(),
        gender: undefined,
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={yup.object().shape({
                firstName: yup.string()
                    .required("First Name must be provided"),
                lastName: yup.string()
                    .required("Last Name is required"),
                username: yup.string()
                    .required("Username must be provided")
                    .matches(/^[a-z0-9]/, "Username must start with a letter or number")
                    .min(6, "Username must be at least 6 characters long")
                    .max(20, "Username cannot be more than 20 characters")
                    .matches(/^[a-z0-9-_.]+$/, "Username can only contain lowercase letters, numbers, dashes( - ), and underscores( _ )"),
                birthday: yup.date(),
                gender: yup.mixed().oneOf(['male', 'female', 'transgender', 'agender', 'non-binary', 'other', undefined]),
                // bio: yup.string().max(150, "Bio can only be up to 150 characters").optional()
            })}
            onSubmit={async (values) => { 
                try {
                    console.log(values);
                    await updateAccount({
                        ...values,
                        birthday: isToday(values.birthday) ? undefined : values.birthday,
                    });

                    await router.push('/feed');
                } catch (err) {
                    console.log('error');
                }
            }}
        >
            {props => (
                <Form className="flex flex-col gap-4 bg-white p-8 rounded-xl mx-6 max-w-screen-sm">
                    <h1 className="text-center text-sky-500 text-2xl font-semibold">Tell Us About You</h1>
                    {serverError && (<ErrorBox message={serverError} />)}
                    <div className="flex flex-col md:flex-row gap-2">
                        <TextInput 
                            label="First Name"
                            id='firstName'
                            name="firstName"
                            placeholder="e.x. Benji"
                            value={props.values.firstName}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            error={props.errors.firstName}
                            touched={props.touched.firstName}
                            required
                        />
                        <TextInput 
                            label="Last Name"
                            id='lastName'
                            name="lastName"
                            placeholder="e.x. Riethmeier"
                            value={props.values.lastName}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            error={props.errors.lastName}
                            touched={props.touched.lastName}
                            required
                        />
                    </div>
                    <TextInput 
                        label="Username"
                        id='username'
                        name='username'
                        placeholder="e.x. benji-handle"
                        value={props.values.username}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        error={props.errors.username}
                        touched={props.touched.username}
                        required
                    />

                    <SelectInput 
                        label="Gender"
                        placeholder="Gender"
                        name="gender"
                        value={props.values.gender}
                        onChange={(value) => props.setFieldValue("gender", value)}
                        items={[
                            { value: "male", text: "Male" },
                            { value: "female", text: "Female" },
                            { value: "transgender", text: "Transgender" },
                            { value: "non-binary", text: "Non-Binary" },
                            { value: "agender", text: "Agender" },
                            { value: 'other', text: 'Other' }
                        ]}
                    />

                    <DateInput 
                        onChange={(value) => {props.setFieldValue('birthday', value)}} 
                        dateValue={props.values.birthday}
                    />

                    <Button variant="filled" type="submit">
                        {props.isSubmitting ? (
                            <AiOutlineLoading className="animate-spin" />     
                        ) : (
                            "Submit"
                        )}
                    </Button>

                    <hr />

                    <Button type="button" variant="minimal" onClick={() => generateRandomData(props)}>
                        Populate Account with Fake Data
                    </Button>

                </Form>
            )}
        </Formik>
    )
}

export default AboutYouForm;