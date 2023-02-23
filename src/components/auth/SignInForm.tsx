import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TextInput from "../inputs/TextInput";

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
        </form>
    )
}

export default SignInForm;