import { entryDTO } from "../models/models";

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

      alert(isUser);
      return isUser;
    } catch (error) {
      console.log("Could not validate user");
      alert("Could not validate user");
      return false;
    }
  },

  async getUserEntries(userId: number): Promise<any> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/entries/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: entryDTO[] = await response.json();
      console.log(data);
    } catch (error) {
      alert("User entries were not fetched from database as expected");
      console.log(error);
    }
  },
};
