import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  successMessage: null,
  errorMessage: null,
  showSuccess: (message) => {
    set({ successMessage: message });
    setTimeout(() => {
      set({ successMessage: null });
    }, 5000);
  },
  showError: (message) => {
    set({ errorMessage: message });
    setTimeout(() => {
      set({ errorMessage: null });
    }, 5000);
  },
}));

export const useBlogStore = create((set) => ({
  blogs: [],
  setBlogs: (blogs) => set({ blogs }),
}));


