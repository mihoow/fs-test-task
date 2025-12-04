import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { ProductCard } from '../cards/Product';
import { Button } from '../button';
import { useFilterContext } from '../../contexts/filters';
import { ChevronDown } from 'react-feather';
import { getRequest } from '../../api';
import type { IProduct } from '../../interfaces/product';
import type { IPagination, Paginated } from '../../interfaces/pagination';

export const Products = () => {
  const { filters, query } = useFilterContext();

  const productsSearchParams = new URLSearchParams({
    c: String(filters.capacity),
    ec: filters.energyClass,
    f: filters.feature,
    s: filters.sort,
    q: query,
  }).toString();

  const [debouncedParams, setDebouncedParams] = useDebounce(productsSearchParams, 500, {
    leading: true,
  });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 0,
    hasMore: false,
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setDebouncedParams(productsSearchParams);
  }, [productsSearchParams, setDebouncedParams]);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    (async () => {
      setIsLoading(true);
      // setProducts([]);
      setError(null);

      try {
        const { items, pagination } = await getRequest<Paginated<IProduct>>(
          `/api/v1/products?${debouncedParams}`,
          {
            signal: abortControllerRef.current?.signal,
          }
        );
        setProducts(items);
        setPagination(pagination);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;

        console.error('PRODUCTS FETCH ERROR: ', error);
        setError(error instanceof Error ? error : new Error('Something went wrong'));
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      // either aborting fetching declared in this useEffect
      // OR fetching called via loadMore() function
      abortControllerRef.current?.abort();
    };
  }, [debouncedParams]);

  const loadMore = async () => {
    if (isLoading || isLoadingMore || !pagination.hasMore) return;

    setIsLoadingMore(true);

    abortControllerRef.current = new AbortController();
    const nextPage = pagination.page + 1;

    try {
      const { items, pagination } = await getRequest<Paginated<IProduct>>(
        `/api/v1/products?${debouncedParams}&p=${nextPage}`,
        {
          signal: abortControllerRef.current.signal,
        }
      );
      setProducts((curr) => [...curr, ...items]);
      setPagination(pagination);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;

      console.error('PRODUCTS LOAD MORE ERROR: ', error);
      // TODO: temporary solution
      alert('Nie udało się pobrać więcej produktów. Spróbuj ponownie!');
    } finally {
      setIsLoadingMore(false);
    }
  };

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

  if (products.length === 0) {
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
        {products.map((product) => (
          <ProductCard key={product.code} {...product} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {pagination.hasMore && (
          <Button
            variant={'tertiary'}
            value={'Pokaż więcej'}
            icon={<ChevronDown />}
            disabled={isLoading || isLoadingMore}
            onClick={loadMore}
          />
        )}
      </div>
    </>
  );
};
