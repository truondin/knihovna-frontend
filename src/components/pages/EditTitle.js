import { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../connection/axios";
import { CustomMenu, CustomToggle } from "./Dropdown";

function EditTitle() {
	const [error, setError] = useState(" ");
	const navigate = useNavigate();
	const { isbn } = useParams();
	const [book, setBook] = useState(undefined);
	const [allGenres, setAllGenres] = useState(undefined);
	const [allAuthors, setAllAuthors] = useState(undefined);
	const [bookName, setBookName] = useState("");
	const [ISBN, setISBN] = useState("");
	const [oldISBN, setOldISBN] = useState("");
	const [selectedAuthor, setSelectedAuthor] = useState({
		id: 0,
		firstName: "Vyberte autora",
		lastName: "",
	});
	const [selectedGenres, setSelectedGenres] = useState(undefined);
	let x = 0;

	const getBook = () => {
		axios
			.get("/dispatcher/titles/b/" + isbn)
			.then((response) => {
				console.log(response);
				setBook(response.data[0]);
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
				console.log(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};

	const getAllAuthors = () => {
		axios
			.get("/dispatcher/authors")
			.then((response) => {
				setAllAuthors(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const updateBook = () => {
		if (
			ISBN === "" ||
			selectedAuthor.id === 0 ||
			selectedGenres.length === 0 ||
			bookName === ""
		) {
			setError("Něco tam chybí");
			return;
		}
		axios
			.put(
				"/dispatcher/titles/update/" + oldISBN,
				{
					isbn: ISBN,
					titleName: bookName,
					author: selectedAuthor,
					genres: selectedGenres,
				},
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			.then(() => {
				navigate("/");
			})
			.catch((e) => {
				if (e.response.status == 409) {
					setError("Toto ISBN již nějaký titul má");
				}
			});
	};
	useEffect(() => {
		getGenres();
		getAllAuthors();
		getBook();
	}, []);
	useEffect(() => {
		setSelectedAuthor(book?.author);
		setSelectedGenres(book?.genres);
		setBookName(book?.titleName);
		setOldISBN(book?.isbn);
		setISBN(book?.isbn);
	}, [book]);
	return (
		<>
			<Container
				style={{
					display: "flex",
					paddingTop: "10vh",
					height: "100vh",
					justifyContent: "center",
					textAlign: "center",
				}}
			>
				<Row>
					<Col>
						<Form>
							<h4>Upravit knihu</h4>
							<Form.Group
								className="mb-3"
								style={{
									display: "flex",
									justifyContent: "center",
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<Form.Label>
									<h6>Název knihy</h6>
								</Form.Label>
								<Form.Control
									type="text"
									style={{ maxWidth: "60%", marginBottom: "5vh" }}
									onChange={(e) => {
										setBookName(e.target.value);
									}}
									defaultValue={bookName}
								/>
								<Form.Label>
									<h6>ISBN</h6>
								</Form.Label>
								<Form.Control
									type="text"
									style={{ maxWidth: "60%", marginBottom: "5vh" }}
									onChange={(e) => {
										setISBN(e.target.value);
									}}
									defaultValue={isbn}
								/>
								<Form.Label>
									<h6>Autor</h6>
								</Form.Label>
								<Dropdown>
									<Dropdown.Toggle
										as={CustomToggle}
										id="dropdown-custom-components"
									>
										{selectedAuthor?.firstName + " " + selectedAuthor?.lastName}
									</Dropdown.Toggle>

									<Dropdown.Menu as={CustomMenu}>
										{allAuthors?.map((author) => {
											return (
												<Dropdown.Item
													eventKey="1"
													onClick={() => {
														setSelectedAuthor(author);
													}}
												>
													{author.firstName + " " + author.lastName}
												</Dropdown.Item>
											);
										})}
									</Dropdown.Menu>
								</Dropdown>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>Kategorie</Form.Label>
								<div
									className="mb-3"
									style={{ display: "flex", flexWrap: "wrap" }}
								>
									{selectedGenres !== undefined
										? allGenres?.map((g) => {
												x++;
												return (
													<Form.Check
														style={{ minWidth: "5vw" }}
														inline
														label={g.name}
														name="group1"
														type="checkbox"
														id={x}
														onChange={(e) => {
															console.log(selectedGenres);
															if (e.target.checked) selectedGenres.push(g);
															else
																setSelectedGenres(
																	selectedGenres.filter(
																		(genre) => genre.name !== g.name
																	)
																);
														}}
														defaultChecked={
															selectedGenres?.filter(
																(gen) => gen.name === g.name
															).length > 0
														}
													/>
												);
										  })
										: ""}
								</div>
							</Form.Group>
							<Button
								onClick={() => {
									updateBook();
								}}
							>
								Upravit knihu
							</Button>
							<h6 style={{ color: "red" }}>{error}</h6>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default EditTitle;
