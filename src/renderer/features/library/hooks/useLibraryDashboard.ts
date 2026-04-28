import { useCallback, useEffect, useState } from "react";
import { BOOK_STATUS, type AsyncState, type BookFilters, type LibraryDashboardData } from "../types";
import { loadLibraryDashboard } from "../services/libraryService";

type UseLibraryDashboardResult = {
  filters: Required<BookFilters>;
  refresh: () => Promise<void>;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  state: AsyncState<LibraryDashboardData>;
};

const initialFilters: Required<BookFilters> = {
  search: "",
  status: BOOK_STATUS.ALL
};

export function useLibraryDashboard(): UseLibraryDashboardResult {
  const [filters, setFilters] = useState<Required<BookFilters>>(initialFilters);
  const [state, setState] = useState<AsyncState<LibraryDashboardData>>({ status: "idle" });

  const loadData = useCallback(async (activeFilters: Required<BookFilters>) => {
    setState({ status: "loading" });

    try {
      const data = await loadLibraryDashboard(activeFilters);
      setState({ status: "success", data });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Unable to load the library dashboard.";

      setState({ status: "error", error: message });
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  const setSearch = useCallback((search: string) => {
    setFilters((currentFilters) => ({ ...currentFilters, search }));
  }, []);

  const setStatus = useCallback((status: string) => {
    setFilters((currentFilters) => ({ ...currentFilters, status }));
  }, []);

  const refresh = useCallback(() => loadData(filters), [filters, loadData]);

  return {
    filters,
    refresh,
    setSearch,
    setStatus,
    state
  };
}
