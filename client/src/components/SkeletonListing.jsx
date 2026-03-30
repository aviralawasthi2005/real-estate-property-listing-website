import Skeleton from "./Skeleton";

export default function SkeletonListing() {
    return (
        <div className='glass-card rounded-[32px] w-full flex flex-col overflow-hidden border border-white/10 dark:border-white/5'>
            <Skeleton className="h-[250px] w-full rounded-none opacity-50" />
            <div className='p-6 flex flex-col gap-4'>
                <Skeleton className="h-6 w-3/4 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-full rounded-full" />
                    <Skeleton className="h-3 w-4/5 rounded-full" />
                </div>
                <div className='mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between'>
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <div className='flex gap-2'>
                        <Skeleton className="h-6 w-12 rounded-lg" />
                        <Skeleton className="h-6 w-12 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
