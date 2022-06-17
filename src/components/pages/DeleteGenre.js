import { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../connection/axios";
import { CustomMenu, CustomToggle } from "./Dropdown";

function DeleteGenre() {
	const navigate = useNavigate();
	const [allGenres, setAllGenres] = useState(undefined);
	const [error, setError] = useState(" ");
	const [selectedGenre, setSelectedGenre] = useState({
		id: 0,
		name: "Vyberte žánr",
	});

	const getAllGenres = () => {
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
	useEffect(() => {
		getAllGenres();
	}, []);
	const deleteGenre = () => {
		if (selectedGenre.id === 0) {
			setError("Vyberte žánr");
			return;
		}
		axios
			.delete("/dispatcher/genres/delete/" + selectedGenre.id, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})
			.then(() => {
				navigate("/");
			})
			.catch((e) => {
				if (e.response.status == 409) {
					setError("Žánr obsahuje nějaký titul");
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
							<h4>Odstranit žánr</h4>
							<Form.Label>
								<h6>Žánr nesmí obsahovat žádný titul</h6>
							</Form.Label>
							<Dropdown>
								<Dropdown.Toggle
									as={CustomToggle}
									id="dropdown-custom-components"
								>
									{selectedGenre.name}
								</Dropdown.Toggle>

								<Dropdown.Menu as={CustomMenu}>
									{allGenres?.map((genre) => {
										return (
											<Dropdown.Item
												eventKey="1"
												onClick={() => {
													setSelectedGenre(genre);
												}}
											>
												{genre.name}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
							<Button
								onClick={() => {
									deleteGenre();
								}}
							>
								Odstranit žánr
							</Button>
							<h6 style={{ color: "red" }}>{error}</h6>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default DeleteGenre;
