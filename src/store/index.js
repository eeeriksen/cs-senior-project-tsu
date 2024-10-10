import { create } from 'zustand'

export const useStore = create((set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),

    globalPosts: {},
    setUniversityPosts: (university, posts) => set((state) => ({
        globalPosts: {
            ...state.globalPosts,
            [university]: posts,
        }
    })),

    addCommentsToPost: (postId, comments) => set((state) => ({
        posts: state.posts.map(post =>
            post.postId === postId ? { ...post, comments } : post
        )
    })),

    user: null,
    setUser: (user) => set({ user }),

    searchSelectedItem: null,
    setSearchSelectedItem: (searchSelectedItem) => set({ searchSelectedItem }),

    selectedFilter: 'Latest',
    setSelectedFilter: (selectedFilter) => set({ selectedFilter }),
}))