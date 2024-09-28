import { create } from 'zustand'

export const useStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    searchSelectedItem: null,
    setSearchSelectedItem: (searchSelectedItem) => set({ searchSelectedItem }),
}))