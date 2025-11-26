export function isLoggedIn() {
  const token = localStorage.getItem("authToken");
  if (!token) return false;
  try {
    const decode = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return decode.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const getCurrentAdmin = () => {
  const admin = localStorage.getItem("currentAdmin");
  return admin ? JSON.parse(admin) : null;
};
