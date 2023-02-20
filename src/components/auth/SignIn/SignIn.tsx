import { Button, Center, TextInput, Stack, Divider } from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";

import { FcGoogle } from 'react-icons/fc';

const SignIn = () => {

    const signInForm = useForm({
        initialValues: {
            email: '',
        },

        validate: {
            email: isEmail('Invalid email')
        }
    });

    const handleSignInButtonClick = () => {
        console.log("sign in here")
    }

    return (
        <Center>
            <Stack>
                <TextInput 
                    placeholder="Email"
                    type="email"
                    label="Email"
                    withAsterisk
                    error={signInForm.errors.email}
                />

                <Button
                    variant="filled"
                    color="indigo"
                    onClick={handleSignInButtonClick}
                >
                    Sign In
                </Button>
                <Divider />
                <Button
                    variant="outline"
                    leftIcon={<FcGoogle />}
                >
                    Sign In With Google
                </Button>
            </Stack>
        </Center>
    )
}

export default SignIn;