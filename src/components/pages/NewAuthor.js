import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../connection/axios";

function NewAuthor() {
	const [error, setError] = useState(" ");
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const createNewAuthor = () => {
		if (firstName === "" || lastName === "") {
			setError("Něco tam chybí");
			return;
		}
		axios
			.post(
				"/dispatcher/authors",
				{
					firstName: firstName,
					lastName: lastName,
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
				if (e.response.status === 409) {
					setError("Autor už existuje");
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
							<h4>Vytvořit nového autora</h4>
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
									<h6>Křestní jméno</h6>
								</Form.Label>
								<Form.Control
									type="text"
									style={{ maxWidth: "60%", marginBottom: "5vh" }}
									onChange={(e) => {
										setFirstName(e.target.value);
									}}
								/>
								<Form.Label>
									<h6>Příjmení</h6>
								</Form.Label>
								<Form.Control
									type="text"
									style={{ maxWidth: "60%", marginBottom: "5vh" }}
									onChange={(e) => {
										setLastName(e.target.value);
									}}
								/>
							</Form.Group>
							<Button
								onClick={() => {
									createNewAuthor();
								}}
							>
								Vytvořit autora
							</Button>
							<h6 style={{ color: "red" }}>{error}</h6>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default NewAuthor;
