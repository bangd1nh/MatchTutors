// import { create } from "zustand";
// import { IUser } from "@/types/user";

// interface AuthState {
//     user: IUser | null;
//     token: string | null;
//     isAuthenticated: boolean;
//     login: (user: IUser, token: string) => void;
//     logout: () => void;
//     setUser: (user: IUser | null) => void;
// }

// let initialToken: string | null = null;
// try {
//     if (typeof window !== "undefined") {
//         initialToken = localStorage.getItem("token");
//     }
// } catch (e) {
//     console.error("Lỗi khi đọc token từ localStorage", e);
// }

// export const useAuthStore = create<AuthState>((set) => ({
//     user: null, // Bắt đầu với user là null
//     token: initialToken,
//     isAuthenticated: !!initialToken,

//     // Action: Đăng nhập
//     login: (user, token) => {
//         try {
//             localStorage.setItem("token", token);
//         } catch (e) {
//             console.error("Không thể lưu token vào localStorage", e);
//         }
//         set({ user, token, isAuthenticated: true });
//     },

//     // Action: Đăng xuất
//     logout: () => {
//         try {
//             localStorage.removeItem("token");
//         } catch (e) {
//             console.error("Không thể xóa token từ localStorage", e);
//         }
//         set({ user: null, token: null, isAuthenticated: false });
//     },

//     setUser: (user) => {
//         set({ user });
//     },
// }));
