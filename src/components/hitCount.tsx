export function HitCount({ count }: { count: number }) {
    return (
        <div className="p-5 bg-white rounded-xl flex items-center justify-center font-bold text-lg">
            {count}
        </div>
    );
}
