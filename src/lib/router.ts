import { useState, useEffect, useCallback } from 'react';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path.split('?')[0]);
    setSearchParams(new URLSearchParams(path.includes('?') ? path.split('?')[1] : ''));
  }, []);

  const matchRoute = useCallback((pattern: string): RouteMatch | null => {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = currentPath.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        const paramName = patternPart.slice(1);
        params[paramName] = decodeURIComponent(pathPart);
      } else if (patternPart !== pathPart) {
        return null;
      }
    }

    return { path: currentPath, params };
  }, [currentPath]);

  return {
    currentPath,
    searchParams,
    navigate,
    matchRoute,
  };
}

export function generateTourUrl(slug: string | null | undefined, id: string): string {
  return `/tour/${slug || id}`;
}

export function generateBookingUrl(slug: string | null | undefined, id: string): string {
  return `/tour/${slug || id}/book`;
}
