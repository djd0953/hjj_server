import { Navigation } from '@components/layout/Navigation';

export default function Header({ className }: { className: string }) {
    return (
        <header className={className}>
            <Navigation />
        </header>
    );
}
