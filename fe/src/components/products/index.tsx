import { ProductCard } from '../cards/Product';
import { Button } from '../button';
import { useFilterContext } from '../../contexts/filters';
import { ChevronDown } from 'react-feather';
import type { IProduct } from '../../interfaces/product';
import { useEffect, useState } from 'react';
import { getRequest } from '../../api';

export const Products = () => {
  const { filters, query } = useFilterContext();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      setIsLoading(true);
      setProducts([]);
      setError(null);

      try {
        const products = await getRequest<IProduct[]>('/api/v1/products', {
          signal: abortController.signal,
        });
        setProducts(products);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;

        console.error('PRODUCTS FETCH ERROR: ', error);
        setError(error instanceof Error ? error : new Error('Something went wrong'));
      } finally {
        setIsLoading(false);
      }
    })();

    return () => abortController.abort();
  }, []);

  const searchByCode = products.filter((product) => {
    return product.code.toLowerCase().includes(query.toLowerCase());
  });

  const filteredProducts = searchByCode.filter((product) => {
    if (filters.capacity && product.capacity !== filters.capacity) {
      return false;
    }
    if (filters.energyClass && product.energyClass !== filters.energyClass) {
      return false;
    }
    return !(filters.feature && !product.features.includes(filters.feature));
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (filters.sort === 'price') {
      return a.price.value - b.price.value;
    }
    if (filters.sort === 'capacity') {
      return a.capacity - b.capacity;
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div>
        <p className="text-center text-gray-500 text-xl mt-4">Trwa ładowanie produktów...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="text-center text-gray-500 text-xl mt-4">
          Nie udało się pobrać produktów. Spróbuj ponownie później.
        </p>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div>
        <p className="text-center text-gray-500 text-xl mt-4">
          Brak produktów spełniających kryteria wyszukiwania
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-x-4 gap-y-5">
        {sortedProducts.map((product) => (
          <ProductCard key={product.code} {...product} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Button
          variant={'tertiary'}
          value={'Pokaż więcej'}
          icon={<ChevronDown />}
          onClick={() => console.log('some action')}
        />
      </div>
    </>
  );
};
