import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import {
	Link,
	useParams,
	useSearchParams,
	useNavigate,
} from "react-router-dom";
import axios from "../../connection/axios";
import { UserContext } from "../../context/UserContext";

function Profile() {
	const { user } = useContext(UserContext);
	const [reservations, setReservation] = useState(undefined);
	const [bookLoans, setBookLoan] = useState(undefined);
	const { username } = useParams();
	const { isbn } = useParams();
	const [author, setAuthor] = useState(null);
	let navigate = useNavigate();
	let i = 1;
	let j = 1;

	const getReservations = async () => {
		await axios
			.get("/dispatcher/users/" + user.username + "/reservations")
			.then((response) => {
				setReservation(response.data);
				console.log(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};

	const getBookLoans = async () => {
		await axios
			.get("/dispatcher/users/" + user.username + "/bookloans")
			.then((response) => {
				setBookLoan(response.data);
				//console.log(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};

	const cancelReservation = (id) => {
		axios
			.delete("/dispatcher/reservations", {
				headers: { "Content-Type": "application/json" },
				data: { id: id },
				withCredentials: true,
			})
			.then(setReservation(reservations.filter((p) => p[0] !== id)))
			.catch((e) => {
				console.error(e);
			});

		//console.log(availableBooks);
		// await axios
		// 	.delete("/dispatcher/reservations/" + id)
		// 	.then(setReservation(reservations.filter((p) => p[0] !== id)))
		// 	.catch((e) => {
		// 		console.error(e);
		// 	});
	};

	useEffect(() => {
		if (user == "") {
			navigate("/");
		}
		getReservations();
		getBookLoans();
	}, []);

	return (
		<Container style={{ paddingTop: "8.5vh" }}>
			<Row>
				<Col>
					<Row className="col-12">
						<h1 style={{ marginTop: "4vh", marginLeft: "2vw" }}>
							Uživatel: {user.username}
						</h1>
						<h1>List rezervovaných knih:</h1>

						<Table striped bordered hover variant="dark">
							<thead>
								<tr>
									<th>#</th>
									<th>Kniha</th>
									<th>Datum rezervace</th>
									<th>Datum expirace</th>
									<th>Zrušit rezervaci</th>
								</tr>
							</thead>
							<tbody>
								{console.log(reservations)}
								{reservations !== undefined
									? reservations.map((r) => {
											return (
												<tr /*key={key}*/>
													<td>{i++}</td>
													<td>{r[1]}</td>
													<td>{r[2]}</td>
													<td>{r[3]}</td>
													<td>
														<Button
															style={{
																backgroundColor: "red",
																border: "none",
															}}
															onClick={() => {
																cancelReservation(r[0]);
															}}
														>
															Zrušit rezervaci
														</Button>
													</td>
												</tr>
											);
									  })
									: " "}
							</tbody>
						</Table>

						<h1>List půjčených knih:</h1>

						<Table striped bordered hover variant="dark">
							<thead>
								<tr>
									<th>#</th>
									<th>Kniha</th>
									<th>Datum půjčení</th>
									<th>Datum nejpozdějšího vrácení</th>
									{/* <th>Dní do vrácení</th> */}
								</tr>
							</thead>
							<tbody>
								{bookLoans !== undefined
									? bookLoans.map((b) => {
											return (
												<tr /*key={key}*/>
													<td>{j++}</td>
													<td
														style={{ cursor: "pointer" }}
														onClick={() => {
															navigate("/books/b/" + b[4]);
														}}
													>
														{b[1]}
													</td>
													<td>{b[2]}</td>
													<td>{b[3]}</td>
													{/* <td>X</td> */}
												</tr>
											);
									  })
									: " "}
							</tbody>
						</Table>
					</Row>
				</Col>
			</Row>
		</Container>
	);
}

export default Profile;
