import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TextInput from "../inputs/TextInput";
import Button from "../buttons/Button";

const SignInForm = () => {

    const { register } = useForm({
        defaultValues: {
            email: ''
        },
        resolver: zodResolver(z.object({
            email: z.string().email(),
        }))
    });

    return (
        <form>
            <TextInput 
                id="email"
                placeholder="email@example.com"
                label="Email"
                type="email"
                {...register("email")}
            />
            <Button onClick={() => console.log("Click")}>
                Sign In
            </Button>
        </form>
    )
}

export default SignInForm;