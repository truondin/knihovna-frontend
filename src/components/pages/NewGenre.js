import { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../connection/axios";
import { CustomMenu, CustomToggle } from "./Dropdown";

function NewGenre() {
	const [error, setError] = useState(" ");
	const navigate = useNavigate();
	const [genreName, setGenreName] = useState("");
	const createNewAuthor = () => {
		if (genreName === "") {
			setError("Musíte napsat název žánru");
			return;
		}
		axios
			.post(
				"/dispatcher/genres",
				{
					name: genreName,
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
					setError("Žánr už existuje");
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
							<h4>Vytvořit nový žánr</h4>
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
									<h6>Název žánru</h6>
								</Form.Label>
								<Form.Control
									type="text"
									style={{ maxWidth: "60%", marginBottom: "5vh" }}
									onChange={(e) => {
										setGenreName(e.target.value);
										console.log(genreName);
									}}
								/>
							</Form.Group>
							<Button
								onClick={() => {
									createNewAuthor();
								}}
							>
								Vytvořit žánr
							</Button>
							<h6 style={{ color: "red" }}>{error}</h6>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default NewGenre;
