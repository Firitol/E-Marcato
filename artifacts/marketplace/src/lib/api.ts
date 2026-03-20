import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = "/api";

export type RecommendationProduct = {
  id: number;
  name: string;
  price: number | string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  categoryName?: string;
  category?: { name?: string };
  originalPrice?: number | string;
  discount?: number;
};

export type HomeRecommendationsResponse = {
  featured: RecommendationProduct[];
  trending: RecommendationProduct[];
  forYou: RecommendationProduct[];
  deals: RecommendationProduct[];
  newArrivals: RecommendationProduct[];
};


async function fetchJSON(path: string, options?: RequestInit) {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.message || err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  get: (path: string) => fetchJSON(path),
  post: (path: string, body: any) => fetchJSON(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path: string, body: any) => fetchJSON(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path: string) => fetchJSON(path, { method: "DELETE" }),
};

// Hooks
export function useProducts(params?: Record<string, any>) {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : "";
  return useQuery({ queryKey: ["products", params], queryFn: () => api.get(`/products${qs}`) });
}

export function useProduct(id: number | null) {
  return useQuery({ queryKey: ["product", id], queryFn: () => api.get(`/products/${id}`), enabled: !!id });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: () => api.get("/categories") });
}

export function useSearch(q: string, params?: Record<string, any>) {
  const qs = params ? "&" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : "";
  return useQuery({ queryKey: ["search", q, params], queryFn: () => api.get(`/search?q=${encodeURIComponent(q)}${qs}`), enabled: !!q });
}

export function useCart() {
  return useQuery({ queryKey: ["cart"], queryFn: () => api.get("/cart"), retry: false });
}

export function useOrders(params?: Record<string, any>) {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : "";
  return useQuery({ queryKey: ["orders", params], queryFn: () => api.get(`/orders${qs}`) });
}

export function useOrder(id: number | null) {
  return useQuery({ queryKey: ["order", id], queryFn: () => api.get(`/orders/${id}`), enabled: !!id });
}

export function useRecommendations() {
  return useQuery<HomeRecommendationsResponse>({
    queryKey: ["recommendations"],
    queryFn: () => api.get("/recommendations/homepage"),
    retry: false,
  });
}

export function useWishlist() {
  return useQuery({ queryKey: ["wishlist"], queryFn: () => api.get("/wishlist"), retry: false });
}

export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: () => api.get("/notifications"), retry: false });
}

export function useCurrentUser() {
  return useQuery({ queryKey: ["me"], queryFn: () => api.get("/auth/me"), retry: false });
}

export function useSellerProfile() {
  return useQuery({ queryKey: ["seller-profile"], queryFn: () => api.get("/sellers/me"), retry: false });
}

export function useSellerAnalytics(period: string = "30d") {
  return useQuery({ queryKey: ["seller-analytics", period], queryFn: () => api.get(`/sellers/me/analytics?period=${period}`) });
}

export function useSellerOrders(params?: Record<string, any>) {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : "";
  return useQuery({ queryKey: ["seller-orders", params], queryFn: () => api.get(`/sellers/me/orders${qs}`) });
}

export function useAdminDashboard() {
  return useQuery({ queryKey: ["admin-dashboard"], queryFn: () => api.get("/admin/dashboard") });
}

export function useAdminUsers(params?: Record<string, any>) {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : "";
  return useQuery({ queryKey: ["admin-users", params], queryFn: () => api.get(`/admin/users${qs}`) });
}

export function useAdminSellers(params?: Record<string, any>) {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : "";
  return useQuery({ queryKey: ["admin-sellers", params], queryFn: () => api.get(`/admin/sellers${qs}`) });
}

export function useAdminOrders(params?: Record<string, any>) {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : "";
  return useQuery({ queryKey: ["admin-orders", params], queryFn: () => api.get(`/admin/orders${qs}`) });
}

export function useAdminAnalytics(period: string = "30d") {
  return useQuery({ queryKey: ["admin-analytics", period], queryFn: () => api.get(`/admin/analytics?period=${period}`) });
}

export function useProductReviews(productId: number | null) {
  return useQuery({ queryKey: ["reviews", productId], queryFn: () => api.get(`/products/${productId}/reviews`), enabled: !!productId });
}

export function useSimilarProducts(productId: number | null) {
  return useQuery({ queryKey: ["similar", productId], queryFn: () => api.get(`/recommendations/similar/${productId}`), enabled: !!productId });
}

export function useSellerProducts(params?: Record<string, any>) {
  const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString() : "";
  return useQuery({ queryKey: ["seller-products", params], queryFn: () => api.get(`/products${qs}`) });
}
