import { PRODUCT_ITEMS } from '@constants/main';

import { ProductCard } from './ProductCard';

export const ProductGrid = () => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {PRODUCT_ITEMS.map((item, i) => (
                <ProductCard
                    isIntro={item.title === 'Intro'}
                    key={`ProductCard-${i}`}
                    title={item.title}
                    image={item.image}
                    hoverImage={item.hoverImage}
                    href={item.href}
                />
            ))}
        </div>
    );
};
