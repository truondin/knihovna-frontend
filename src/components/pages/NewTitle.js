import { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../connection/axios";
import { CustomMenu, CustomToggle } from "./Dropdown";

function NewTitle() {
	const [error, setError] = useState(" ");
	const navigate = useNavigate();
	const [allGenres, setAllGenres] = useState(undefined);
	const [allAuthors, setAllAuthors] = useState(undefined);
	const [bookName, setBookName] = useState("");
	const [ISBN, setISBN] = useState("");
	const [selectedAuthor, setSelectedAuthor] = useState({
		id: 0,
		firstName: "Vyberte autora",
		lastName: "",
	});
	const [selectedGenres] = useState([]);
	let x = 0;

	const getGenres = () => {
		axios
			.get("/dispatcher/genres")
			.then((response) => {
				setAllGenres(response.data);
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
	const createNewBook = () => {
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
			.post(
				"/dispatcher/titles/create",
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
					setError("Titul už existuje");
				}
			});
	};
	useEffect(() => {
		getGenres();
		getAllAuthors();
	}, []);
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
							<h4>Přidat novou Knížku</h4>
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
									<h6>Název titulu</h6>
								</Form.Label>
								<Form.Control
									type="text"
									style={{ maxWidth: "60%", marginBottom: "5vh" }}
									onChange={(e) => {
										setBookName(e.target.value);
									}}
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
								/>
								<Form.Label>
									<h6>Autor</h6>
								</Form.Label>
								<Dropdown>
									<Dropdown.Toggle
										as={CustomToggle}
										id="dropdown-custom-components"
									>
										{selectedAuthor.firstName + " " + selectedAuthor.lastName}
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
									{allGenres?.map((g) => {
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
													if (e.target.checked) selectedGenres.push(g);
													else selectedGenres.pop(g);
												}}
											/>
										);
									})}
								</div>
							</Form.Group>
							<Button
								onClick={() => {
									createNewBook();
								}}
							>
								Přidat titul
							</Button>
							<h6 style={{ color: "red" }}>{error}</h6>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default NewTitle;
