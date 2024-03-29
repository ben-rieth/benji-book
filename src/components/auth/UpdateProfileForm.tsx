import { Formik, Form } from 'formik';
import type { ReactNode} from 'react';
import { useState, type FC } from 'react';
import { type Self } from '../../types/User';
import DateInput from '../inputs/DateInput';
import SelectInput from '../inputs/SelectInput';
import TextInput from '../inputs/TextInput';
import * as yup from 'yup';
import TextArea from '../inputs/TextArea';
import Button from '../general/Button';
import { api } from '../../utils/api';
import { isToday } from 'date-fns';
import { toast } from 'react-hot-toast';
import Modal from '../general/Modal';
import { EditIcon } from '../general/icons';
import { AiOutlineLoading } from 'react-icons/ai';
import ErrorBox from '../error/ErrorBox';

type UpdateProfileFormProps = {
    user: Self;
    trigger?: ReactNode;
}

type FormValues = {
    firstName: string;
    lastName: string;
    username: string;
    birthday: Date;
    gender: 'male' | 'female' | 'transgender' | 'agender' | 'non-binary' | 'other' | undefined;
    bio: string;
}

const UpdateProfileForm:FC<UpdateProfileFormProps> = ({ user, trigger }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | undefined>();

    const apiUtils = api.useContext();
    const { mutateAsync: updateAccount } = api.users.updateAccount.useMutation({
        onMutate: async (values) => {
            await apiUtils.users.getOneUser.cancel();

            apiUtils.users.getOneUser.setData(
                { userId: user.id }, 
                prev => {
                    if (!prev) return;
                    return {...prev, ...values}
                }
            );
        },

        onError: (error) => {
            setServerError(error.message);
            toast.error("Could not update profile. Try again.");
        },

        onSuccess: () => {
            setOpen(false);
            toast.success("Profile updated successfully!");
        },

        onSettled: async () => {
            await apiUtils.users.getOneUser.invalidate({ userId: user.id })
        }
    });

    return (
        <Modal
            title="Update Your Profile"
            open={open}
            onOpenChange={open => setOpen(open)}
            trigger={trigger ? trigger : <EditIcon />}
        >
            <Formik
                initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender ? user.gender : undefined,
                    bio: user.bio ? user.bio : '',
                    birthday: user.birthday ? user.birthday : new Date(),
                    username: user.username,
                } as FormValues}
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
                    bio: yup.string().max(150, "Bio can only be up to 150 characters").optional()
                })}
                onSubmit={async (values) => {
                    await updateAccount({
                        ...values,
                        birthday: isToday(values.birthday) ? undefined : values.birthday,
                    });
                }}
            >
                {(props) => (
                    <Form className="flex flex-col gap-4 pt-3">

                        {serverError && <ErrorBox message={serverError} />}

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
                            onChange={(value) => props.setFieldValue('birthday', value)} 
                            dateValue={props.values.birthday}
                        />

                        <TextArea 
                            id="bio"
                            label="Bio"
                            placeholder="Bio"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            name="bio"
                            value={props.values.bio}
                            error={props.errors.bio}
                            touched={props.touched.bio}
                        />
                        
                        <Button variant="filled" onClick={props.submitForm}>
                            {props.isSubmitting ? (
                                <AiOutlineLoading className="animate-spin" />     
                            ) : (
                                "Save Changes"
                            )}
                        </Button>

                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default UpdateProfileForm;