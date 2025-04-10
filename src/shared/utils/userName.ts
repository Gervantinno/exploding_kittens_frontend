export const getUsername = () => localStorage.getItem('username');
export const setUsername = (username: string) => localStorage.setItem('username', username);
