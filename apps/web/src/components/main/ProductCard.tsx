'use client';

import { ProductCardProps } from '@models/main/main';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export const ProductCard = ({ isIntro, title, image, hoverImage, href }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        if (!isIntro) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (!isIntro) setIsHovered(false);
    };

    const showHover = isIntro || isHovered;

    const cardContent = (
        <div
            className="group relative flex aspect-[1/1] cursor-pointer flex-col overflow-hidden rounded shadow transition-transform hover:scale-[1.03]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {!showHover && (
                <>
                    <div className="relative h-full w-full">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-opacity duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    </div>
                    <div className="absolute bottom-0 w-full bg-[#1A75BC] py-2 text-center text-sm font-medium text-white transition-opacity duration-300 group-hover:opacity-0 sm:text-base">
                        {title}
                    </div>
                </>
            )}

            {showHover && (
                <Image
                    src={isIntro ? image : hoverImage}
                    alt={isIntro ? title : `hover-${title}`}
                    fill
                    className={cn(
                        'absolute top-0 left-0 h-full w-full object-cover opacity-0 transition-opacity duration-300',
                        isIntro ? 'opacity-100' : 'group-hover:opacity-100',
                    )}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
            )}
        </div>
    );

    return href ? <Link href={href}>{cardContent}</Link> : cardContent;
};
