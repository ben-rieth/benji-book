import { isNotEmpty, useForm } from '@mantine/form';
import { Center, Stack, Group, TextInput, Select, Button } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

interface FormValues {
    firstName: string;
    lastName: string;
    handle: string;
    birthday: Date;
    gender: string;
}

const AboutYouForm = () => {
    const form = useForm<FormValues>({
        initialValues: {
            firstName: '',
            lastName: '',
            handle: '',
            birthday: new Date(),
            gender: '',
        },
        
        validate: {
            firstName: isNotEmpty('First name must be provided'),
            lastName: isNotEmpty('Last name must be provided'),
            handle: isNotEmpty('Username must be created'),
            birthday: (value) => {
                const date = new Date();
                date.setFullYear(date.getFullYear() - 13);

                return value > date ? "Must be 13 years or older" : null;
            },
        }
    })
    
    return (
        <Center>
            <form 
                onSubmit={form.onSubmit((values) => console.log(values))}
            >
                <Stack>
                    <Group position='center'>
                        <TextInput 
                            placeholder="First Name"
                            label="First Name"
                            withAsterisk
                            {...form.getInputProps('firstName')}
                        />
                        <TextInput 
                            placeholder="Last Name"
                            label="Last Name"
                            withAsterisk
                            {...form.getInputProps('lastName')}
                        />
                    </Group>
                    <TextInput 
                        placeholder="Username"
                        label="Username"
                        withAsterisk
                        {...form.getInputProps('handle')}
                    />
                    <DatePicker 
                        placeholder="Birthday"
                        label="Your Birthday"
                        withAsterisk
                        allowLevelChange
                        clearable
                        {...form.getInputProps('birthday')}
                    />
                    <Select 
                        placeholder='Select Gender'
                        data={['Male', 'Female', 'Non-Binary', 'Gender Fluid', 'Transgender', 'Agender', 'Other']}
                        label="Gender"
                        {...form.getInputProps('gender')}
                    />

                    <Button type="submit">
                        Submit
                    </Button>
                </Stack>
            </form>
        </Center>
    )
}

export default AboutYouForm;