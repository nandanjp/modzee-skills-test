// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../context/AuthContext";

// import axios from "axios";

// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../context/AuthContext";

// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../context/AuthContext";
// import { createAppSlice } from "@/app/createAppSlice";
// import type { User } from "@/utils/types";

// export const useLogin = () =>
// {
//     const [loading, setLoading] = useState(false);
//     const { setAuthUser } = useAuthContext()!;

//     const login = async ({ username, password }: {
//         username: string,
//         password: string,

//     }) =>
//     {
//         const success = handleInputErrors({ username, password });
//         if (!success)
//         {
//             return;
//         }

//         setLoading(true);
//         try
//         {
//             const res = await fetch("api/auth/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ username, password })
//             });

//             const data = await res.json();
//             if (data.error)
//             {
//                 throw new Error(data.error);
//             }
//             //save to local storage and use context to login
//             localStorage.setItem("chat-user", JSON.stringify(data));
//             setAuthUser(data);
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any)
//         {
//             toast.error(error.message);
//         } finally
//         {
//             setLoading(false);
//         }

//     };
//     return { loading, login };
// };

// export default useLogin;

// function handleInputErrors({ username, password }: {
//     username: string,
//     password: string,

// })
// {
//     if (!username || !password)
//     {
//         toast.error("Please fill in all the fields");
//         return false;
//     }

//     if (password.length < 6)
//     {
//         toast.error("Password length must be greater than 6");
//         return false;
//     }

//     return true;
// }

// export const useLogout = () =>
// {
//     const [loading, setLoading] = useState(false);
//     const { setAuthUser } = useAuthContext()!;

//     const logout = async () =>
//     {
//         setLoading(true);
//         try
//         {
//             const res = await fetch("api/auth/logout", {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//             });
//             const data = await res.json();
//             if (data.error)
//             {
//                 throw new Error(data.error);
//             }
//             localStorage.removeItem("chat-user");
//             setAuthUser(null);
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any)
//         {
//             toast.error(error.message);
//         } finally
//         {
//             setLoading(false);
//         }

//     };
//     return { loading, logout };
// };

// export default useLogout;

// export const useSignup = () =>
// {
//     const [loading, setLoading] = useState(false);
//     const { setAuthUser } = useAuthContext()!;

//     const signup = async ({ fullName, username, password, confirmPassword, gender }: {
//         fullName: string,
//         username: string,
//         password: string,
//         confirmPassword: string,
//         gender: string;
//     }) =>
//     {
//         const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
//         if (!success)
//         {
//             return;
//         }

//         setLoading(true);
//         try
//         {
//             const res = await fetch("api/auth/signup", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ fullName, username, password, confirmPassword, gender })
//             });

//             const data = await res.json();
//             if (data.error)
//             {
//                 throw new Error(data.error);
//             }
//             //save to local storage and use context to login
//             localStorage.setItem("chat-user", JSON.stringify(data));
//             setAuthUser(data);
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any)
//         {
//             toast.error(error.message);
//         } finally
//         {
//             setLoading(false);
//         }

//     };
//     return { loading, signup };
// };

// export default useSignup;

// function handleInputErrors({ fullName, username, password, confirmPassword, gender }: {
//     fullName: string,
//     username: string,
//     password: string,
//     confirmPassword: string,
//     gender: string;
// })
// {
//     if (!fullName || !username || !password || !confirmPassword || !gender)
//     {
//         toast.error("Please fill in all the fields");
//         return false;
//     }
//     if (password !== confirmPassword)
//     {
//         toast.error("Passwords do not match");
//         return false;
//     }

//     if (password.length < 6)
//     {
//         toast.error("Password length must be greater than 6");
//         return false;
//     }

//     return true;
// }
