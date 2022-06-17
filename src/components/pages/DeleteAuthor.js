import { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../connection/axios";
import { CustomMenu, CustomToggle } from "./Dropdown";

function DeleteAuthor() {
	const [error, setError] = useState(" ");
	const navigate = useNavigate();
	const [allAuthors, setAllAuthors] = useState(undefined);
	const [selectedAuthor, setSelectedAuthor] = useState({
		id: 0,
		firstName: "Vyberte autora",
		lastName: "",
	});

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
	useEffect(() => {
		getAllAuthors();
	}, []);
	const deleteAuthor = () => {
		if (selectedAuthor.id === 0) {
			setError("Vyberte žánr");
			return;
		}
		axios
			.delete("/dispatcher/authors/delete/" + selectedAuthor.id, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})
			.then(() => {
				navigate("/");
			})
			.catch((e) => {
				if (e.response.status == 409) {
					setError("Autor má nějaký titul");
				}
			});
	};
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
							<h4>Odstranit autora</h4>
							<Form.Label>
								<h6>Autor nesmí mít žádný titul</h6>
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
							<Button
								onClick={() => {
									deleteAuthor();
								}}
							>
								Odstranit autora
							</Button>
							<h6 style={{ color: "red" }}>{error}</h6>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default DeleteAuthor;
