import * as Tooltip from '@radix-ui/react-tooltip';

const WhyNoPassword = () => {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <p className="underline text-xs text-center cursor-pointer">Why Don&apos;t I Need a Password</p>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content sideOffset={5} className="w-72 text-sm text-center rounded-lg bg-white p-2 border border-sky-500">
                        <p>After submitting, an email will be sent to your inbox.
                        In this email, there will be a magic link that signs you in!</p>
                        <Tooltip.Arrow className="fill-sky-500" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}

export default WhyNoPassword;