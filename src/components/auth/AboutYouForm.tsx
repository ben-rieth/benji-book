import { Form, Formik } from "formik";
import * as yup from 'yup';
import TextInput from "../inputs/TextInput";

const AboutYouForm = () => {

    const thirteenYearsAgo = new Date();
    thirteenYearsAgo.setFullYear(2001);

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                username: '',
                birthday: '',
                gender: ''
            }}
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
                    .matches(/^[a-z0-9-_]+$/, "Username can only contain lowercase letters, numbers, dashes( - ), and underscores( _ )"),
                birthday: yup.date()
                    .max(thirteenYearsAgo, "Must be at least 13 years old to use app."),
                gender: yup.string().matches(/(male|female|non-binary|transgender|agender|other)/, { excludeEmptyString: true })
            })}
            onSubmit={(values) => console.log(values)}
        >
            {props => (
                <Form>
                    <h1 className="text-center text-sky-500 text-2xl font-semibold">Tell Us About You</h1>
                    <div className="flex flex-row gap-3">
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
                </Form>
            )}
        </Formik>
    )
}

export default AboutYouForm;