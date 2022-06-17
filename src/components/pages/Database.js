import React, { useEffect, useState } from "react";
import { Container, Dropdown, Row, Col } from "react-bootstrap";
import axios from "../../connection/axios";
import "./Database.css";
import PaginatedBooks from "./PaginatedBooks";
import { useSearchParams } from "react-router-dom";

export default function Database() {
	const [searchParams] = useSearchParams();
	const [currentPage] = useState(searchParams.get("category"));
	const [allBooks, setAllBooks] = useState(null);
	const [genre, setGenre] = useState("All");
	const [order, setOrder] = useState("Jména knih A-Z");
	const [allGenres, setAllGenres] = useState(null);
	const [genres, setGenres] = useState(allGenres);
	const [books, setBooks] = useState(allBooks);
	const getBooks = () => {
		axios
			.get("/dispatcher/titles/all")
			.then((response) => {
				setAllBooks(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const getGenres = () => {
		axios
			.get("/dispatcher/genres")
			.then((response) => {
				setAllGenres(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
				return null;
			});
	};
	const sortBooks = (sort) => {
		let sortingBooks = books;
		switch (sort) {
			case "aaz":
				sortingBooks.sort((a, b) => {
					let fa = a[3].toLowerCase(),
						fb = b[3].toLowerCase();

					if (fa < fb) {
						return -1;
					}
					if (fa > fb) {
						return 1;
					}
					return 0;
				});
				break;
			case "aza":
				sortingBooks.sort((a, b) => {
					let fa = a[3].toLowerCase(),
						fb = b[3].toLowerCase();

					if (fa > fb) {
						return -1;
					}
					if (fa < fb) {
						return 1;
					}
					return 0;
				});
				break;
			case "az":
				sortingBooks.sort((a, b) => {
					let fa = a[1].toLowerCase(),
						fb = b[1].toLowerCase();

					if (fa < fb) {
						return -1;
					}
					if (fa > fb) {
						return 1;
					}
					return 0;
				});
				break;
			case "za":
				sortingBooks.sort((a, b) => {
					let fa = a[1].toLowerCase(),
						fb = b[1].toLowerCase();

					if (fa > fb) {
						return -1;
					}
					if (fa < fb) {
						return 1;
					}
					return 0;
				});
				break;
			default:
				break;
		}
		let arr = [];
		sortingBooks.forEach((b) => arr.push(b));
		setBooks(arr);
	};

	const findBook = (input) => {
		setGenre("All");
		changeBooksToAll();
		let result = [];
		allBooks?.map((book) => {
			if (book[0].includes(input)) {
				result.push(book);
			} else if (book[1].includes(input)) {
				result.push(book);
			} else if (book[2].includes(input)) {
				result.push(book);
			} else if (book[3].includes(input)) {
				result.push(book);
			}
		});
		setBooks(result);
		console.log(result);
	};

	const changeBooks = (g) => {
		axios
			.get("/dispatcher/titles/g/" + g)
			.then((response) => {
				setBooks(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
				return null;
			});
	};

	const changeBooksToAll = () => {
		setBooks(allBooks);
	};

	useEffect(() => {
		setGenres(allGenres);
	}, [allGenres]);
	useEffect(() => {
		setBooks(allBooks);
	}, [allBooks]);

	useEffect(() => {
		getBooks();
		getGenres();
		if (currentPage !== null) {
			changeBooks(currentPage);
		}
	}, []);
	const refresh = (b) => {
		return (
			<>
				<Container
					className="database"
					style={{ minHeight: "92vh", paddingTop: "10vh" }}
				>
					<Row
						xs={3}
						style={{
							height: "100%",
							marginBottom: "5vh",
							justifyContent: "space-between",
						}}
					>
						<Col
							xs={6}
							style={{
								justifyContent: "space-evenly",
								alignItems: "center",
								display: "flex",
							}}
						>
							<Dropdown style={{ minWidth: "10vw" }}>
								<Dropdown.Toggle
									id="dropdown-button-dark-example1"
									variant="secondary"
								>
									{genre}
								</Dropdown.Toggle>

								<Dropdown.Menu variant="dark">
									<Dropdown.Item
										onClick={() => {
											setGenre("All");
											changeBooksToAll();
										}}
									>
										All
									</Dropdown.Item>
									{genres
										? genres.map((g) => {
												return (
													<Dropdown.Item
														onClick={() => {
															setGenre(g.name);
															changeBooks(g.name);
														}}
													>
														{g.name}
													</Dropdown.Item>
												);
										  })
										: " "}
								</Dropdown.Menu>
							</Dropdown>
							<Dropdown style={{ minWidth: "10vw" }}>
								<Dropdown.Toggle
									id="dropdown-button-dark-example1"
									variant="secondary"
								>
									{order}
								</Dropdown.Toggle>

								<Dropdown.Menu variant="dark">
									<Dropdown.Item
										onClick={() => {
											setOrder("Jména knih A-Z");
											sortBooks("az");
										}}
									>
										Jména knih A-Z
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => {
											setOrder("Jména knih Z-A");
											sortBooks("za");
										}}
									>
										Jména knih Z-A
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => {
											setOrder("Příjmení autorů A-Z");
											sortBooks("aaz");
										}}
									>
										Příjmení autorů A-Z
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => {
											setOrder("Příjmení autorů Z-A");
											sortBooks("aza");
										}}
									>
										Příjmení autorů Z-A
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Col
							xs={6}
							style={{
								justifyContent: "space-evenly",
								alignItems: "center",
								display: "flex",
							}}
						>
							<h2>Vyhledávání:</h2>
							<input
								id="search"
								type="search"
								onChange={(input) => {
									findBook(input.target.value);
								}}
							/>
						</Col>
					</Row>
					<Row xs={9}>
						{books == null ? (
							"Načítání knížek..."
						) : (
							<PaginatedBooks
								books={b}
								itemsPerPage="20"
								currentPage={currentPage - 1}
							/>
						)}
					</Row>
				</Container>
			</>
		);
	};

	useEffect(() => {
		refresh(books);
	}, [books]);
	return refresh(books);
}
