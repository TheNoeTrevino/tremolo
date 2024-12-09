export const UserService = {
  async loginUser(username: string, password: string): Promise<boolean> {
    try {
      // TODO: replace with url to our user backend
      const response = await fetch("http://127.0.0.1:8000/random", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const isUser = Boolean(data);
      return isUser;
    } catch (error) {
      console.log("Could not validate user");
      return false;
    }
  },
};
