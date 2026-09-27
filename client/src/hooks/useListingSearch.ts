import { useState, useEffect, useCallback } from 'react';
import { Listing, SearchFilterParams } from '../types';
import { api } from '../services/api.client';

interface UseListingSearchResult {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  filters: SearchFilterParams;
  updateFilters: (newFilters: Partial<SearchFilterParams>) => void;
  refetch: () => Promise<void>;
}

export const useListingSearch = (initialParams: SearchFilterParams = {}): UseListingSearchResult => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilterParams>(initialParams);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listings.getListings(filters);
      setListings(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch property listings';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      startIndex: newFilters.startIndex ?? 0, // Reset to first page unless specified
    }));
  }, []);

  return {
    listings,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchListings,
  };
};

export default useListingSearch;
