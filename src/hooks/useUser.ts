import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/types/user";

// Mở rộng DecodedToken để bao gồm các trường từ JWT payload
interface DecodedToken extends IUser {
   id: string;
   email: string;
   iat: number;
   exp: number;
}

const fetchUserFromToken = async (): Promise<DecodedToken | null> => {
   const token = localStorage.getItem("token");
   if (!token) {
      return null;
   }
   try {
      const decodedUser = jwtDecode<DecodedToken>(token);
      // Tự động xóa token nếu đã hết hạn
      if (decodedUser.exp * 1000 < Date.now()) {
         localStorage.removeItem("token");
         return null;
      }
      return decodedUser;
   } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem("token");
      return null;
   }
};

export const useUser = () => {
   const {
      data: user,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["user", "auth"],
      queryFn: fetchUserFromToken,
      staleTime: Infinity,
      gcTime: Infinity,
   });
   const isAuthenticated = !!user;

   return { user, isLoading, isError, isAuthenticated };
};
