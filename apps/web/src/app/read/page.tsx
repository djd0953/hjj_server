type CityStat = {
    id: number;
    name: string;
    price: {
        id: number;
        max: number;
        min: number;
        avg: number;
    }[];
};

async function getStats() {
    const res = await fetch('http://localhost:4000/cityPrice', { cache: 'no-store' });
    return res.json();
}

async function getItem() {
    const res = await fetch('http://localhost:4000/item', { cache: 'no-store' });
    return res.json();
}

export default async function Page() {
    const item = await getItem();
    const stats = await getStats();

    return (
        <main className="mx-auto mt-8 max-w-3xl">
            <PriceStatsTable item={item} stats={stats} />
        </main>
    );
}

function PriceStatsTable({
    item,
    stats,
}: {
    item: { id: number; name: string }[];
    stats: CityStat[];
}) {
    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">도시·아이템별 가격 통계</h2>
            <table className="w-full border-collapse border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2"></th>
                        {stats.map((col, idx) => (
                            <th key={`${col.id}-${idx}`} className="border px-4 py-2" colSpan={3}>
                                {col.name}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        <th className="border px-4 py-2"></th>
                        {stats.map((col, idx) => (
                            <>
                                <th key={`${col.id}-max-${idx}`} className="border px-4 py-2">
                                    max
                                </th>
                                <th key={`${col.id}-min-${idx}`} className="border px-4 py-2">
                                    min
                                </th>
                                <th key={`${col.id}-avg-${idx}`} className="border px-4 py-2">
                                    avg
                                </th>
                            </>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {item.map((row, idx) => {
                        return (
                            <tr key={`${row.id}-${idx}`}>
                                <td className="border px-4 py-2">{row.name}</td>
                                {stats.map((c, i) => {
                                    const p = c.price.find((x) => x && x.id === row.id);
                                    if (!p)
                                        return (
                                            <>
                                                <td key={`${i}-max`} className="border px-4 py-2">
                                                    -
                                                </td>
                                                <td key={`${i}-min`} className="border px-4 py-2">
                                                    -
                                                </td>
                                                <td key={`${i}-avg`} className="border px-4 py-2">
                                                    -
                                                </td>
                                            </>
                                        );
                                    else
                                        return (
                                            <>
                                                <td
                                                    key={`${p.id}-max`}
                                                    className="border px-4 py-2">
                                                    {p.max.toLocaleString()}
                                                </td>
                                                <td
                                                    key={`${p.id}-min`}
                                                    className="border px-4 py-2">
                                                    {p.min.toLocaleString()}
                                                </td>
                                                <td
                                                    key={`${p.id}-avg`}
                                                    className="border px-4 py-2">
                                                    {Math.floor(p.avg)}
                                                </td>
                                            </>
                                        );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
