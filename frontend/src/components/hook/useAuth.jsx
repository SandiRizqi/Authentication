import { useState, useEffect } from "react";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/credentials/check-auth/`, {
                    method: "GET",
                    credentials: "include", // Include cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setIsAuthenticated(true);
                    setUser(data.username); // Assuming Django returns { "username": "..." }
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []); // Run on mount

    return { isAuthenticated, user };
};

export default useAuth;
