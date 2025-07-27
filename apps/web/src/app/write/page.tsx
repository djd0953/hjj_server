'use client';

import { useEffect, useState } from 'react';

type City = { id: number; name: string };
type Item = { id: number; name: string };

export default function Page2() {
    const [cities, setCities] = useState<City[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [prices, setPrices] = useState<{ [itemId: number]: number }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 최초 마운트 시 데이터 불러오기
    useEffect(() => {
        Promise.all([
            fetch('http://localhost:4000/city').then((res) => res.json()),
            fetch('http://localhost:4000/item').then((res) => res.json()),
        ]).then(([citiesData, itemsData]) => {
            setCities(citiesData);
            setItems(itemsData);
            setSelectedCityId(citiesData[0]?.id ?? null);
            setLoading(false);
        });
    }, []);

    // 가격 입력 핸들러
    const handlePriceChange = (itemId: number, value: string) => {
        setPrices((prev) => ({
            ...prev,
            [itemId]: Number(value) || 0,
        }));
    };

    const handleSave = async () => {
        if (!selectedCityId) {
            alert('도시를 선택하세요.');
            return;
        }
        setSaving(true);

        // price 배열 구성
        const payload = items
            .map((item) => ({
                city_id: selectedCityId,
                item_id: item.id,
                price: prices[item.id] ?? 0,
            }))
            .filter((row) => row.price > 0); // 0 이하 가격은 제외

        if (!payload.length) {
            alert('입력된 가격이 없습니다.');
            setSaving(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/price/bulkCreate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                alert('저장 완료!');
                setPrices({});
                scrollTo(0, 0);
            } else {
                alert('저장 실패!');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4">로딩 중...</div>;
    if (!cities.length || !items.length) return <div>데이터가 없습니다.</div>;

    return (
        <main className="mx-auto mt-8 max-w-xl">
            <div className="mb-4 flex items-center gap-2">
                <select
                    value={selectedCityId ?? ''}
                    onChange={(e) => setSelectedCityId(Number(e.target.value))}
                    className="rounded border px-3 py-2">
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded bg-blue-500 px-4 py-2 text-white">
                    {saving ? '저장중...' : '저장'}
                </button>
            </div>

            <div className="rounded border bg-gray-50 p-4">
                <table className="mb-4 w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">아이템</th>
                            <th className="border px-4 py-2">가격 입력</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="number"
                                        min={0}
                                        className="w-24 rounded border px-2 py-1"
                                        value={prices[item.id] ?? ''}
                                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                        placeholder="가격"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={handleSave}
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white">
                    저장
                </button>
            </div>
        </main>
    );
}
