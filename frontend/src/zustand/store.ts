import { User } from "@/utils/types";
import { create } from "zustand";

interface AuthState
{
    authUser: User | undefined;
    setAuthUser: (user: User) => void;
}

export const authStore = create<AuthState>()(set => ({
    authUser: undefined,
    setAuthUser: authUser => set(() => ({ authUser: authUser }))
}));