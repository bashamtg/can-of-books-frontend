import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { withAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Container, Card, Button, Form } from "react-bootstrap";
import BookFormModal from "./BookFormModal";
let SERVER = process.env.REACT_APP_SERVER;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchedBooks: [],
      books: [],
      disable: false,
      currentBook: {},
      showBookForm: false,
    };
  }
  getGoogleBooks = async (e) => {
    e.preventDefault();
    try {
      let searchedBooks = await axios.get(
        `${SERVER}/googlebooks?q=${this.state.query}`
      );
      this.setState({
        searchedBooks: searchedBooks.data,
        disable: false,
      });
      console.log(searchedBooks);
    } catch (error) {
      console.log("error updating", error.message);
    }
  };
  handleFormInput = (e) => {
    this.setState({
      query: e,
    });
  };
  postBook = async (newBook) => {
    try {
      let url = `${process.env.REACT_APP_SERVER}/books`;
      let createdBook = await axios.post(url, newBook);
      this.setState({
        books: [...this.state.books, createdBook.data],
      });
    } catch (error) {
      console.log("we have an error:", error.response.data);
    }
  };

  handleNewBook = (element) => {
    let newBook = {
      title: element.title,
      description: element.description,
      status: false,
      email: this.props.auth0.user.email,
      author: element.author[0],
      canonicalVolumeLink: element.canonicalVolumeLink,
    };

    this.postBook(newBook);

    // this.setState({
    //   disable: true
    // })
  };

  bookForUpdate = (element) => {
    this.setState({
      currentBook: element,
    });
  };

  addBookHandler = () => {
    this.setState({
      showBookForm: true,
    });
  };

  addBookRemove = () => {
    this.setState({
      showBookForm: false,
    });
  };

  postBook = async (newBook) => {
    try {
      let url = `${process.env.REACT_APP_SERVER}/books`;
      let createdBook = await axios.post(url, newBook);
      this.setState({
        books: [...this.state.books, createdBook.data],
      });
    } catch (error) {
      console.log("we have an error:", error.response.data);
    }
  };
  render() {
    console.log(this.state);

    let renderedBooks = this.state.searchedBooks.map((element, index) => {
      return (
        <Card className="individual-card" key={index}>
          <Card.Body className="real-card-body">
            <Card.Title>{element.title}</Card.Title>

            <Card.Text>{element.author}</Card.Text>

            <Card.Text>{element.description}</Card.Text>

            <Card.Text>
              <a
                className="btn btn-info"
                href={element.canonicalVolumeLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="info"
              >
                View on Google Books™
              </a>
            </Card.Text>

            <Button
              onClick={() => this.handleNewBook(element)}
              type="checkbox"
              className="btn-check"
              autoComplete="off"
              size="sm"
              disabled={this.state.disable}
              variant="outline-primary"
            >
              Add To Bookshelf
            </Button>

            <BookFormModal
              email={this.props.auth0.user.email}
              show={this.state.showBookForm}
              addBookRemove={this.addBookRemove}
              postBook={this.postBook}
            />
          </Card.Body>
        </Card>
      );
    });

    return (
      <div>
        <h2>Hello, {this.props.auth0.user.name}</h2>

        <Container className="search-bar">
          <Form>
            <Form.Group className="mb-3" controlId="formSearch">
              <Form.Label className="search-label">
                Find a Book to add to your Digital Bookshelf{" "}
              </Form.Label>
              <Form.Control
                type="text"
                onInput={(event) => {
                  this.handleFormInput(event.target.value);
                }}
                placeholder="Powered by Google Books "
              ></Form.Control>
            </Form.Group>
            <Button
              className="rollOut"
              type="submit"
              onClick={this.getGoogleBooks}
            >
              Search Books
            </Button>
          </Form>
          <Button
            id="ad-book-btn"
            className="w-100"
            onClick={this.addBookHandler}
            variant="outline-primary"
          >
            Add book outside of Google Books
          </Button>
          <BookFormModal
            email={this.props.auth0.user.email}
            show={this.state.showBookForm}
            addBookRemove={this.addBookRemove}
            postBook={this.postBook}
          />
        </Container>

        <Container className="renderedBooks">{renderedBooks}</Container>
      </div>
    );
  }
}

export default withAuth0(Main);
