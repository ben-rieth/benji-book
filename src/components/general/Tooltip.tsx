import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { FC } from 'react';

type TooltipProps = {
    triggerComponent: JSX.Element;
    contentComponent: JSX.Element;
}

const Tooltip: FC<TooltipProps> = ({ triggerComponent, contentComponent }) => {
    return (
        <RadixTooltip.Provider>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>
                    {triggerComponent}
                </RadixTooltip.Trigger>

                <RadixTooltip.Portal>
                    <RadixTooltip.Content sideOffset={5} className="w-72 text-sm text-center rounded-lg bg-white p-2 border border-sky-500">
                        {contentComponent}
                        <RadixTooltip.Arrow className="fill-sky-500" />
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    )
};

export default Tooltip;