'use client';

import { COMPONY_TITLE } from '@constants/navigation';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import NavigationMenuMobile from './NavigationMenuMobile';
import NavigationMenuPC from './NavigationMenuPC';

export function Navigation() {
    return (
        <div className="mx-auto flex h-full w-full items-center justify-evenly gap-4 sm:px-6 lg:px-8">
            {/* 로고 */}
            <Link href="/" className="flex items-center gap-2 pb-[25px] text-lg font-bold">
                <Image src="/images/logo/logo.jpg" alt="logo" width={250} height={80} />
                {/* {COMPONY_TITLE} */}
            </Link>

            {/* PC 메뉴 */}
            <div className="hidden lg:flex">
                <NavigationMenuPC />
            </div>

            {/* 모바일 메뉴 */}
            <div className="ml-auto flex items-center lg:hidden">
                <NavigationMenuMobile />
            </div>
        </div>
    );
}
