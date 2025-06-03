'use client';

import { COMPONY_TITLE } from '@constants/navigation';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import NavigationMenuMobile from './NavigationMenuMobile';
import NavigationMenuPC from './NavigationMenuPC';

export function Navigation({ className = '' }: { className: string }) {
    return (
        <div
            className={cn(
                'mx-auto flex max-w-screen-xl items-center justify-between gap-4',
                className,
            )}>
            {/* 로고 */}
            <Link href="/" className="flex items-center gap-2 text-lg font-bold whitespace-nowrap">
                <Image src="/images/logo/logo.jpg" alt="logo" width={32} height={32} />
                {COMPONY_TITLE}
            </Link>

            {/* PC 메뉴 */}
            <div className="hidden w-full justify-center lg:flex">
                <NavigationMenuPC />
            </div>

            {/* 모바일 메뉴 */}
            <div className="ml-auto flex items-center lg:hidden">
                <NavigationMenuMobile />
            </div>
        </div>
    );
}
