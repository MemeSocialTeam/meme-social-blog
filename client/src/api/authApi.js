const BASE_URL = import.meta.env.VITE_API_URL;

// --- login ---
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();

    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMessages = errorData.errors.map((err) => err.msg).join(", ");
      throw new Error(errorMessages);
    }

    if (errorData.msg) {
      throw new Error(errorData.msg);
    }
    throw new Error("Login failed");
  }
  return res.json();
}

// --- register ---
export async function register(username, email, password) {
  const res = await fetch(`${BASE_URL}/api/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();

    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMessages = errorData.errors.map((err) => err.msg).join(", ");
      throw new Error(errorMessages);
    }

    if (errorData.msg) {
      throw new Error(errorData.msg);
    }
    throw new Error("Registration failed");
  }
  return res.json();
}

// --- logout ---
export async function logout() {
  const res = await fetch(`${BASE_URL}/api/user/logout`, {
    method: "POST",
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.msg || "Logout failed");
  }
  return json;
}

// --- get current user (/me) ---
export async function getMe() {
  const res = await fetch(`${BASE_URL}/api/user/me`, {
    method: "GET",
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.msg || "Not authenticated");
  }
  return json;
}

// --- change password ---
export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPsw: currentPassword,
      password: newPassword,
    }),
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to change password");
  }
}
