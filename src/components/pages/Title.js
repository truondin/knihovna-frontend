import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../connection/axios";
import "./Title.css";
import { UserContext } from "../../context/UserContext";

function Title() {
	const { isbn } = useParams();
	const [book, setBook] = useState(undefined);
	const [allBooks, setAllBooks] = useState(undefined);
	const [genres, setGenres] = useState(undefined);
	const [availableBooks, setAvailableBooks] = useState(undefined);
	const [author, setAuthor] = useState(undefined);
	const { user } = useContext(UserContext);
	const [successBookReserve, setSuccess] = useState(false);
	const navigate = useNavigate();
	let j = 1;

	const getBook = () => {
		axios
			.get("/dispatcher/titles/b/" + isbn)
			.then((response) => {
				setBook(response.data[0]);
				console.log(response);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};

	const getAllBooks = () => {
		axios
			.get("/dispatcher/books/isbn/" + isbn)
			.then((response) => {
				setAllBooks(response.data);
				console.log(response);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const getGenres = () => {
		axios
			.get("/dispatcher/titles/" + isbn + "/genres")
			.then((response) => {
				setGenres(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const getAvailableBooks = () => {
		axios
			.get("/dispatcher/bookloans/getfree/" + isbn)
			.then((response) => {
				console.log(response);
				setAvailableBooks(response.data);
				//console.log(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const reservateBook = () => {
		axios
			.post(
				"/dispatcher/reservations",
				{ bookID: parseInt(availableBooks[0]) },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			.then(
				setAvailableBooks(
					availableBooks.filter((b) => b !== availableBooks[0])
				),
				setSuccess(true)
			)
			.catch((e) => {
				console.error(e);
			});
	};
	const deleteBook = (id) => {
		console.log(id);
		axios
			.delete("/dispatcher/books/delete/" + id, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})
			.then((response) => {
				setAllBooks(response.data);
			});
	};
	const addBook = () => {
		axios
			.post(
				"/dispatcher/books/add",
				{ isbn: book.isbn, titleName: book.titleName },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			.then((response) => {
				setAllBooks(response.data);
			});
	};
	const deleteTitle = () => {
		console.log(book);
		axios
			.delete("/dispatcher/titles/delete/" + book.id, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})
			.then(navigate("/"));
	};
	const getAuthor = () => {
		if (book !== undefined) {
			axios
				.get(
					"/dispatcher/authors/" +
						book.author.firstName +
						"/" +
						book.author.lastName
				)
				.then((response) => {
					setAuthor(response.data[0]);
				})
				.catch((e) => {
					console.error("Server unavailable");
				});
		}
	};
	useEffect(() => {
		getBook();
		getAvailableBooks();
		getGenres();
		getAllBooks();
	}, []);
	useEffect(() => {
		getAuthor();
	}, [book]);
	useEffect(() => {
		refresh();
	}, [author]);
	const refresh = () => {
		return book !== undefined ? (
			<Container style={{ paddingTop: "8.5vh" }}>
				<Row>
					<Col xs="12" className="bookColumn">
						<Row
							style={{
								display: "flex",
								flexDirection: "row",
								flexWrap: "nowrap",
								justifyContent: "space-between",
							}}
						>
							<h1
								style={{ marginTop: "4vh", marginLeft: "2vw", width: "auto" }}
							>
								{book !== undefined ? book.titleName : ""}
							</h1>
							{user?.userType === "LIBRARIAN" ? (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "flex-end",
										width: "auto",
									}}
								>
									<Button
										style={{ width: "auto", marginRight: "0.5vw" }}
										onClick={() => {
											navigate("/books/edit/" + book.isbn);
										}}
									>
										Upravit
									</Button>
									<Button
										style={{ width: "auto", marginRight: "0.5vw" }}
										onClick={() => {
											addBook();
										}}
									>
										Přidat knihu
									</Button>
									<Button
										onClick={() => {
											deleteTitle();
										}}
										disabled={allBooks?.length > 0}
										style={{
											backgroundColor: "red",
											border: "none",
											width: "auto",
											marginRight: "0.5vw",
										}}
									>
										Odstranit
									</Button>
								</div>
							) : (
								""
							)}
						</Row>
						<div
							style={{
								display: "flex",
								flexWrap: "nowrap",
								alignItems: "flex-end",
								justifyContent: "flex-start",
							}}
						>
							<a
								href={
									"/authors/a/" +
									(author !== null && author !== undefined ? author.id : "")
								}
								style={{
									textDecoration: "none",
									color: "black",
								}}
							>
								<h4
									style={{
										marginTop: "1vh",
										marginLeft: "2vw",
										fontWeight: "normal",
									}}
								>
									{book !== undefined
										? book.author.firstName + " " + book.author.lastName
										: ""}
								</h4>
							</a>

							{genres !== undefined
								? genres.map((g) => {
										return (
											<a
												href={"/books?category=" + g.name}
												style={{
													textDecoration: "none",
													color: "black",
												}}
											>
												<h4
													style={{
														marginTop: "1vh",
														fontWeight: "normal",
													}}
												>
													{", " + g.name}
												</h4>
											</a>
										);
								  })
								: genres}
						</div>
						<h4
							style={{
								marginTop: "1vh",
								marginLeft: "2vw",
								fontWeight: "normal",
							}}
						>
							{"ISBN: " + book?.isbn}
						</h4>
						<div
							style={{
								paddingTop: "8.5vh",
								display: "flex",
								justifyContent: "center",
							}}
						>
							<div
								style={{
									display: "table",
									width: "60%",
								}}
							>
								<h1
									style={{
										color: "white",
										//backgroundColor: "white",
										display: "flex",
										padding: "10px",
									}}
								>
									{successBookReserve === true
										? "Kniha byla úspěšně rezervována! ✔"
										: ""}
								</h1>
								<h2 style={{ display: "inline" }}>
									Počet volných knih k rezervaci:
								</h2>
								<h2
									style={{
										display: "inline",
										paddingLeft: "12px",
										paddingRight: "25px",
									}}
								>
									{" "}
									{availableBooks !== undefined ? availableBooks.length : ""}
								</h2>

								{user.username ? (
									availableBooks !== undefined ? (
										availableBooks.length > 0 ? (
											successBookReserve === false ? (
												<Button
													style={{
														backgroundColor: "green",
														borderColor: "green",
													}}
													onClick={() => {
														reservateBook();
													}}
												>
													Rezervovat
												</Button>
											) : (
												<Button
													style={{
														backgroundColor: "white",
														borderColor: "white",
														color: "green",
														cursor: "default",
													}}
												>
													Kniha byla rezervována!
												</Button>
											)
										) : (
											<Button
												style={{
													backgroundColor: "red",
													border: "none",
													cursor: "not-allowed",
												}}
											>
												Není žádná volná kniha k rezervaci
											</Button>
										)
									) : (
										<div> Knihy nebyly nalezeny. Chyba na straně připojení</div>
									)
								) : (
									<div style={{ color: "crimson" }}>
										Přihlašte se pro možnost rezervovat knihu
									</div>
								)}
								{user?.userType === "LIBRARIAN" ? (
									<>
										<h1>List všech knih:</h1>

										<Table
											striped
											bordered
											hover
											variant="dark"
											style={{ width: "100%" }}
										>
											<thead style={{ width: "100%" }}>
												<tr>
													<th>#</th>
													<th>ID knihy</th>
													<th>Stav knihy</th>
													<th>Uživatel</th>
													<th style={{ textAlign: "center" }}>
														Odstranit knihu
													</th>
													{/* <th>Dní do vrácení</th> */}
												</tr>
											</thead>
											<tbody>
												{Array.isArray(allBooks)
													? allBooks?.map((b) => {
															let bookLoans = b.bookLoans.filter(
																(loan) => loan.active === true
															);
															let bookReservations = b.reservedBook.filter(
																(reservation) => reservation.active === true
															);
															let currentUser = "";
															let borrowed = bookLoans?.length > 0;
															let reserved = bookReservations?.length > 0;
															if (borrowed) {
																let loan = bookLoans[0];
																currentUser = loan.user.username;
															}
															if (reserved) {
																let reservation = bookReservations[0];
																currentUser = reservation.user.username;
															}

															return (
																<tr /*key={key}*/>
																	<td>{j++}</td>
																	<td>{b.bookID}</td>
																	<td>
																		{borrowed
																			? "Vypůjčena"
																			: reserved
																			? "Rezervována"
																			: "V knihovně"}
																	</td>
																	<td
																		style={
																			currentUser !== ""
																				? { cursor: "pointer" }
																				: { cursor: "inerheit" }
																		}
																		onClick={() => {
																			if (currentUser !== "")
																				navigate("/users/u/" + currentUser);
																		}}
																	>
																		{currentUser}
																	</td>
																	<td style={{ textAlign: "center" }}>
																		<Button
																			variant="danger"
																			style={{
																				backgroundColor: "red",
																				border: "none",
																			}}
																			onClick={() => {
																				deleteBook(b.bookID);
																			}}
																			disabled={currentUser !== ""}
																		>
																			Odstranit knihu
																		</Button>
																	</td>
																</tr>
															);
													  })
													: " "}
											</tbody>
										</Table>
									</>
								) : (
									""
								)}
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		) : (
			<div style={{ paddingTop: "8.5vh" }}>
				<h1>Titul nenalezen</h1>
			</div>
		);
	};
	return refresh();
}

export default Title;
