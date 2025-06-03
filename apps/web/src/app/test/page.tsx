import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
    return (
        <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
            <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
                <ImageSlider />
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <Image
                    className="dark:invert"
                    src="/images/banner.jpg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <ol className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm/6 sm:text-left">
                    <li className="mb-2 tracking-[-.01em]">
                        Get started by editingaaa{' '}
                        <code className="rounded bg-black/[.05] px-1 py-0.5 font-[family-name:var(--font-geist-mono)] font-semibold dark:bg-white/[.06]">
                            src/app/page.tsx
                        </code>
                        .
                    </li>
                    <li className="tracking-[-.01em]">Save and see your changes instantly.</li>
                </ol>

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <a
                        className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Image
                            className="dark:invert"
                            src="/vercel.svg"
                            alt="Vercel logomark"
                            width={20}
                            height={20}
                        />
                        Deploy now
                    </a>
                    <a
                        className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer">
                        Read our docs
                    </a>
                </div>
            </main>
            <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer">
                    <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer">
                    <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
                    Examples
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer">
                    <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}

const ImageSlider = () => {
    const [currentImgIndex, setCurrentImgIndex] = useState<number>(1);
    const images = ['/images/sliderImg1.png', '/images/sliderImg2.png', '/images/sliderImg3.png'];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImgIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[400px] w-full rounded-lg">
            {images.map((src, i) => (
                <Image
                    key={src}
                    src={src}
                    alt={`Slide ${i}`}
                    fill
                    className={`object-cover transition-opacity duration-700 ${
                        i === currentImgIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`h-3 w-3 rounded-full ${
                            currentImgIndex === i ? 'bg-black' : 'bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};
