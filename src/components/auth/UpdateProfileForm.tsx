import * as Dialog from '@radix-ui/react-dialog';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { useState, type FC } from 'react';
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";
import { type Self } from '../../types/User';
import DateInput from '../inputs/DateInput';
import SelectInput from '../inputs/SelectInput';
import TextInput from '../inputs/TextInput';
import * as yup from 'yup';
import TextArea from '../inputs/TextArea';
import Button from '../general/Button';
import { api } from '../../utils/api';
import { isToday } from 'date-fns';
import { toast } from 'react-toastify';

type UpdateProfileFormProps = {
    user: Self;
}

type FormValues = {
    firstName: string;
    lastName: string;
    username: string;
    birthday: Date;
    gender: 'male' | 'female' | 'transgender' | 'agender' | 'non-binary' | 'other' | undefined;
    bio: string;
}

const UpdateProfileForm:FC<UpdateProfileFormProps> = ({ user }) => {

    const [open, setOpen] = useState<boolean>(false);

    const apiUtils = api.useContext();
    const { mutate: updateAccount } = api.users.updateAccount.useMutation({
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

        onError: () => {
            toast.error("Could not update profile. Try again.");
        },

        onSuccess: () => {
            toast.success("Profile updated successfully!");
        },

        onSettled: async () => {
            await apiUtils.users.getOneUser.invalidate({ userId: user.id })
        }
    });

    return (
        <Dialog.Root 
            open={open} 
            onOpenChange={(open) => setOpen(open)}
        >
            <Dialog.Trigger asChild>
                <AiFillEdit 
                    className={"absolute top-5 right-5 fill-sky-500 w-7 h-7 cursor-pointer hover:scale-110 hover:fill-sky-600"} 
                    onClick={() => console.log("open modal")}
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
                    <Dialog.Title className="font-semibold text-xl text-sky-500">Edit Profile</Dialog.Title>
                    <Dialog.Description className="text-sm text-slate-500">Change any information about your profile! Click save to update account.</Dialog.Description>

                    <Formik
                        initialValues={{
                            firstName: user.firstName as string,
                            lastName: user.lastName as string,
                            gender: user.gender ? user.gender : undefined,
                            bio: user.bio ? user.bio : '',
                            birthday: user.birthday ? user.birthday : new Date(),
                            username: user.username as string,
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
                        onSubmit={(values) => {
                            console.log(values);
                            updateAccount({
                                ...values,
                                birthday: isToday(values.birthday) ? undefined : values.birthday,
                            });
                            setOpen(false);
                        }}
                    >
                        {(props) => (
                            <Form className="flex flex-col gap-4">
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
                                
                                
                                <Button variant="filled" type="submit">
                                    Save Changes
                                </Button>

                            </Form>
                        )}
                    </Formik>

                    <Dialog.Close asChild>
                        <AiOutlineClose 
                            aria-label="Close" 
                            className="fill-red-500 absolute top-5 right-5 w-7 h-7 cursor-pointer hover:fill-red-600 active:bg-red-300 rounded-full p-1"
                        />
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default UpdateProfileForm;