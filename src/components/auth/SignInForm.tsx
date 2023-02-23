import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TextInput from "../inputs/TextInput";
import Button from "../buttons/Button";

const SignInForm = () => {

    const { 
        register,
        formState: { errors },
        handleSubmit
    } = useForm({
        defaultValues: {
            email: ''
        },
        resolver: zodResolver(z.object({
            email: z.string().email({ message: "Not a valid email"}),
        })),
        reValidateMode: 'onBlur'
    });

    const submitToServer = () => {
        console.log("submit")
    }

    return (
        <form onSubmit={handleSubmit(submitToServer)}>
            <TextInput 
                id="email"
                placeholder="email@example.com"
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register("email", { required: "Email is required"})}
            />
            <Button type="submit">
                Sign In
            </Button>
        </form>
    )
}

export default SignInForm;