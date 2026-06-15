const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function registerUser({ name, email, password }) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data; // { token, email, name }
}

export async function loginUser({ email, password }) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data; // { token, email, name }
}

export function saveAuth(authData) {
    localStorage.setItem("ff_token", authData.token);
    localStorage.setItem("ff_user", JSON.stringify({ email: authData.email, name: authData.name }));
}

export function getToken() {
    return localStorage.getItem("ff_token");
}

export function getUser() {
    const u = localStorage.getItem("ff_user");
    return u ? JSON.parse(u) : null;
}

export function clearAuth() {
    localStorage.removeItem("ff_token");
    localStorage.removeItem("ff_user");
}