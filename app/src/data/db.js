import { Guest, User, Root } from "./models";

// DATABASE

const db = {
    guest: new Guest(),
    user: new User(),
    root: new Root(),
};
  

export default db