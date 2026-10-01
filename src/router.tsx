import { QueryClient, dehydrate, hydrate, type DehydratedState } from "@tanstack/react-query";
import { createRouter, ErrorComponent } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorComponent,
    // Data fetched by loaders on the server is sent with the HTML so pages render fully
    // for search engines and the browser doesn't show a "Loading…" state on first paint.
    dehydrate: () => ({ queryClientState: JSON.stringify(dehydrate(queryClient)) }),
    hydrate: (dehydrated: { queryClientState: string }) => {
      hydrate(queryClient, JSON.parse(dehydrated.queryClientState) as DehydratedState);
    },
  });

  return router;
};
