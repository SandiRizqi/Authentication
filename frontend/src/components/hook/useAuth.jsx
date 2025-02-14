import { useState, useEffect } from "react";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async ({username, password}) => {
              const formData = {
                username: username,
                password: password
              }

              const response = await fetch(`${import.meta.env.VITE_API_URL}/credentials/login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Include cookies
                body: JSON.stringify(formData),
            });
        
            if (response.ok) {
                window.location.replace('/');
            } else {
                console.error("Login failed");
            }
              // Add your login logic here
            
    };


    const logout = async () => {
            await fetch(`${import.meta.env.VITE_API_URL}/credentials/logout/`, {
                method: "POST",
                credentials: "include",
            });
            setIsAuthenticated(false);
            setUser(null);
            window.location.replace('/login');
    }
    

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/credentials/check-auth/`, {
                    method: "GET",
                    credentials: "include", // Include cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setUser(data.username); // Assuming Django returns { "username": "..." }
                    // window.location.replace('/')
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    // window.location.replace('/login')
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
                // window.location.replace('/login')
            }
        };

        checkAuth();
    }, []); // Run on mount



    // useEffect(() => {
    //     if(!isAuthenticated) {
    //         window.location.replace('/login');
    //     }
    // },[])


    return { isAuthenticated, login, logout, user };
};

export default useAuth;
