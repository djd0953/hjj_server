'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export const SliderImage = () => {
    const images = ['/images/sliderImg1.png', '/images/sliderImg2.png', '/images/sliderImg3.png'];

    const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
    const [dragX, setDragX] = useState<number>(0);

    const sliderRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);
    const isDragging = useRef(false);
    const timeRef = useRef<NodeJS.Timeout | null>(null);

    const resetImageChangeInterval = () => {
        clearImageChangeInterval();

        timeRef.current = setInterval(() => {
            setCurrentImgIndex((prev) => (prev + 1) % images.length);
        }, 3000);
    };

    const clearImageChangeInterval = () => {
        if (timeRef.current) clearInterval(timeRef.current);
    };

    useEffect(() => {
        resetImageChangeInterval();
        return clearImageChangeInterval;
    }, []);

    const handleGoToIndex = (index: number) => {
        setCurrentImgIndex(index);
        resetImageChangeInterval();
    };

    const handleMouseDownOnImg = (clientX: number) => {
        isDragging.current = true;
        startX.current = clientX;
        clearImageChangeInterval();
    };

    const handleMouseUpOnImg = () => {
        if (!isDragging.current) return;

        if (dragX > 50 && currentImgIndex > 0) {
            setCurrentImgIndex((prev) => prev - 1);
        } else if (dragX < -50 && currentImgIndex < images.length - 1) {
            setCurrentImgIndex((prev) => prev + 1);
        }

        setDragX(0);
        isDragging.current = false;
        resetImageChangeInterval();
    };

    const handleMouseMoveOnImg = (clientX: number) => {
        if (!isDragging.current) return;

        const delta = clientX - startX.current;
        setDragX(delta);
    };

    const handleMouseLeaveOnImg = () => {
        if (isDragging.current) resetImageChangeInterval();

        isDragging.current = false;
    };

    return (
        <div
            className="relative aspect-[16/9] w-full max-w-screen-xl overflow-hidden rounded-lg select-none"
            ref={sliderRef}
            onMouseDown={(e) => {
                e.preventDefault();
                handleMouseDownOnImg(e.clientX);
            }}
            onMouseUp={handleMouseUpOnImg}
            onMouseLeave={handleMouseLeaveOnImg}
            onMouseMove={(e) => handleMouseMoveOnImg(e.clientX)}
            onTouchStart={(e) => handleMouseDownOnImg(e.touches[0].clientX)}
            onTouchEnd={handleMouseUpOnImg}
            onTouchMove={(e) => handleMouseMoveOnImg(e.touches[0].clientX)}>
            <div
                className={cn(
                    'flex h-full',
                    isDragging.current ? '' : 'transition-transform duration-700 ease-in-out',
                )}
                style={{
                    width: `${images.length * 100}%`,
                    transform: `translateX(calc(-${(100 / images.length) * currentImgIndex}% + ${dragX}px))`,
                }}>
                {images.map((src, i) => (
                    <div
                        key={i}
                        className="relative h-full"
                        style={{
                            width: `${100 / images.length}%`,
                            flexShrink: 0,
                        }}>
                        <Image
                            src={src}
                            alt={`Slide ${i}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={i === 0}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`h-3 w-3 rounded-full ${
                            currentImgIndex === i ? 'bg-black' : 'bg-gray-300'
                        } transition-colors duration-300`}
                        onClick={() => handleGoToIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};
