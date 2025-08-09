import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Generic API hook for GET requests
export const useApi = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    ...options
  });
};

// Hook for mutations with automatic cache invalidation
export const useMutationWithInvalidation = (
  mutationFn,
  invalidationKeys = [],
  options = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate specified keys
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options
  });
};

// Hook for debounced API calls
export const useDebouncedApi = (queryKey, queryFn, searchTerm, delay = 500) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return useQuery({
    queryKey: [...queryKey, debouncedSearchTerm],
    queryFn: () => queryFn(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
    staleTime: 5 * 60 * 1000
  });
};

// Hook for infinite scroll/pagination
export const useInfiniteApi = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination?.hasNext) {
        return lastPage.pagination.current + 1;
      }
      return undefined;
    },
    ...options
  });
};

// Hook for optimistic updates
export const useOptimisticMutation = (
  mutationFn,
  queryKey,
  updateFn,
  options = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      if (updateFn && previousData) {
        queryClient.setQueryData(queryKey, updateFn(previousData, newData));
      }

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKey, context.previousData);

      if (options.onError) {
        options.onError(err, newData, context);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });

      if (options.onSettled) {
        options.onSettled();
      }
    },
    ...options
  });
};

// Hook for real-time data with polling
export const useRealtimeApi = (queryKey, queryFn, interval = 30000) => {
  return useQuery({
    queryKey,
    queryFn,
    refetchInterval: interval,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true
  });
};

// Custom hook for form mutations
export const useFormMutation = (mutationFn, options = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      setIsSubmitting(true);
      try {
        const result = await mutationFn(data);
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    ...options
  });

  return {
    ...mutation,
    isSubmitting: isSubmitting || mutation.isLoading
  };
};

// Hook for handling file uploads
export const useFileUpload = (uploadFn, options = {}) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (file) => {
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      return uploadFn(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });
    },
    onSettled: () => {
      setUploadProgress(0);
    },
    ...options
  });

  return {
    ...mutation,
    uploadProgress
  };
};

// Hook for caching strategies
export const useCacheStrategy = (queryKey, queryFn, strategy = 'stale-while-revalidate') => {
  const strategies = {
    'cache-first': {
      staleTime: Infinity,
      cacheTime: Infinity
    },
    'network-first': {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000
    },
    'cache-only': {
      staleTime: Infinity,
      cacheTime: Infinity,
      networkMode: 'offline'
    },
    'network-only': {
      staleTime: 0,
      cacheTime: 0
    },
    'stale-while-revalidate': {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000
    }
  };

  return useQuery({
    queryKey,
    queryFn,
    ...strategies[strategy]
  });
};
