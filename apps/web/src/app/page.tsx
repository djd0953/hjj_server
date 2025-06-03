'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ProductGrid } from '@/components/main/ProductGrid';
import { SliderImage } from '@/components/main/SliderImage';

export default function Home() {
    return (
        <div className="mx-auto w-full max-w-screen-xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
            {/* 메인 슬라이더 */}
            <section>
                <SliderImage />
            </section>

            {/* 제품 안내 */}
            <section>
                <ProductGrid />
            </section>
        </div>
    );
}
