import { ObjectId } from "mongodb";

class BookService {
  constructor(client) {
    this.Book = client.db().collection("Book");
  }

  find;
}

export default new BookService();
