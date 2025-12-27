import { cn } from '@/src/lib/utils';
import ExecutorSelect from '../base/ExecutorSelect';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { GoChevronRight, GoInfinity } from 'react-icons/go';
import { Button } from '../ui/button';
import { FileCode } from 'lucide-react';

interface BuilderMoreOptionsPanelProps {
    close: () => void;
    className: string;
}

export default function BuilderMoreOptionsPanel({
    close,
    className,
}: BuilderMoreOptionsPanelProps) {
    const { executor, setExecutor } = useExecutorStore();

    return (
        <div
            data-lenis-prevent
            className={cn(
                'w-fit max-h-54 flex flex-col items-start',
                'absolute left-44 z-50 bottom-12',
                'bg-darkest border border-neutral-800 shadow-md',
                'rounded-[4px] rounded-bl-none overflow-visible overflow-y-auto',
                className,
            )}
        >
            {/* agent / plan */}
            <Button
                type="button"
                className={cn(
                    'w-full',
                    'bg-transparent hover:bg-transparent flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-300',
                )}
            >
                <div className="flex gap-x-1.5">
                    <GoInfinity className="w-3.5 h-3.5 text-primary " />
                    <span>Agentic</span>
                </div>
                <GoChevronRight />
            </Button>

            {/* templates */}
            <Button
                type="button"
                className={cn(
                    'w-full',
                    'bg-transparent hover:bg-transparent flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-300',
                )}
            >
                <div className="flex justify-center gap-x-1.5">
                    <FileCode className="w-3.5 h-3.5 text-white " />
                    <span>templates</span>
                </div>
                <GoChevronRight />
            </Button>
        </div>
    );
}
