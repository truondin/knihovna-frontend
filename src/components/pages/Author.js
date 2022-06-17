import React, { useEffect, useState } from "react";
import { Container, Dropdown, Row } from "react-bootstrap";
import axios from "../../connection/axios";
import "./Database.css";
import { useParams, useSearchParams } from "react-router-dom";
import AuthorBooks from "./AuthorBooks";

export default function Author() {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const [currentPage] = useState(searchParams.get("category"));
	const [allBooks, setAllBooks] = useState(null);
	const [genre, setGenre] = useState("All");
	const [order, setOrder] = useState("Jména knih A-Z");
	const [allGenres, setAllGenres] = useState(null);
	const [genres, setGenres] = useState(allGenres);
	const [books, setBooks] = useState(allBooks);
	const getBooks = () => {
		const b = axios
			.get("/dispatcher/authors/" + id + "/titles")
			.then((response) => {
				setAllBooks(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const getGenres = () => {
		const b = axios
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
			case "az":
				sortingBooks.sort((a, b) => {
					let fa = a.titleName.toLowerCase(),
						fb = b.titleName.toLowerCase();

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
					let fa = a.titleName.toLowerCase(),
						fb = b.titleName.toLowerCase();

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
					<Row xs={2}>
						{b !== null ? (
							<h1>{b[0].author.firstName + " " + b[0].author.lastName}</h1>
						) : (
							"Loading"
						)}
					</Row>
					<Row xs={3} style={{ height: "100%", marginBottom: "1vh" }}>
						<Dropdown>
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
							</Dropdown.Menu>
						</Dropdown>
					</Row>
					<Row xs={7}>
						{books == null ? (
							"Načítání knížek..."
						) : (
							<AuthorBooks
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
		console.log(books);
		refresh(books);
	}, [books]);
	return refresh(books);
}
