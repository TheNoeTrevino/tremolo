import axios from "axios";

export const UserService = {
  async loginUser(username: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post<boolean>(
        // TODO: make this the correct url
        "http://127.0.0.1:8000/random",
        { username: username, password: password },
        { responseType: "json" },
      );
      const isUser = response.data.valueOf();
      return isUser;
    } catch (error) {
      console.log("Could not validate user");
      return false;
    }
  },
};
