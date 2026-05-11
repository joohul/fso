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
  addBlog: (blog) =>
    set((state) => ({
      blogs: [...state.blogs, blog],
    })),
  updateBlog: (updatedBlog) =>
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog,
      ),
    })),
  removeBlog: (blogId) =>
    set((state) => ({
      blogs: state.blogs.filter((blog) => blog.id !== blogId), 
    })),
}));

export const useUserStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser) => set({ currentUser }),
}));


