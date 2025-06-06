import { NAVIGATION_MENU } from '@constants/navigation';

import * as React from 'react';
import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const NavigationMenuPC = () => {
    return (
        <NavigationMenu className="z-100 w-full justify-center" viewport={false}>
            <NavigationMenuList className="gap-10">
                {NAVIGATION_MENU.map((list) => (
                    <NavigationMenuItem className="relative" key={list.group}>
                        <NavigationMenuTrigger className="text-[1em] font-semibold">
                            {list.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="left-1/2 -translate-x-1/2 rounded-md bg-white text-center shadow-lg">
                            <ul className="grid min-w-[200px] grid-cols-1 gap-2 p-4">
                                {list.items.map((item) => (
                                    <NavigationMenuLink
                                        asChild
                                        key={item.id}
                                        className="text-sm hover:underline">
                                        <Link href={item.href}>{item.title}</Link>
                                    </NavigationMenuLink>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default NavigationMenuPC;
