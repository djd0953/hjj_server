'use client';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@components/ui/sheet';
import { NAVIGATION_MENU } from '@constants/navigation';
import { Menu } from 'lucide-react';

import * as React from 'react';
import Link from 'next/link';

const NavigationMenuMobile = () => {
    return (
        <Sheet>
            <SheetTrigger className="lg:hidden">
                <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-6">
                <div className="space-y-6">
                    {NAVIGATION_MENU.map((list) => (
                        <div key={list.group} className="space-y-2">
                            <SheetTitle className="text-lg font-semibold">{list.title}</SheetTitle>
                            <ul className="space-y-1">
                                {list.items.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            href={item.href}
                                            className="block px-2 py-1 text-sm hover:underline">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default NavigationMenuMobile;
