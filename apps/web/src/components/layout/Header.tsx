import { Navigation } from '@components/layout/Navigation';

export default function Header() {
    return (
        <header className="w-full border-b bg-white px-4 py-4 shadow-sm sm:px-6">
            <Navigation className={'flex w-full items-center justify-center p-10'} />
        </header>
    );
}
