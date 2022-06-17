import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../connection/axios";
import { UserContext } from "../../context/UserContext";

function User() {
	const { user } = useContext(UserContext);
	const { username } = useParams();
	const [reservations, setReservation] = useState(undefined);
	const [bookLoans, setBookLoan] = useState(undefined);
	const [currUser, setCurrUser] = useState(undefined);
	let navigate = useNavigate();
	let i = 1;
	let j = 1;

	const getUser = async () => {
		await axios
			.get("/dispatcher/users/username/" + username)
			.then((response) => {
				setCurrUser(response.data[0]);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const getReservations = async () => {
		await axios
			.get("/dispatcher/users/" + username + "/reservations")
			.then((response) => {
				setReservation(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const loanBook = async (id) => {
		console.log(id);
		await axios
			.post(
				"/dispatcher/bookloans",
				{ reservationId: id, userId: currUser.id },
				// [id, currUser.id],
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log(response);
				getReservations();
				getBookLoans();
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const returnBook = async (id) => {
		await axios
			.put("/dispatcher/bookloans/return", {
				data: { id: id },
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})
			.then((response) => {
				getReservations();
				getBookLoans();
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};

	const getBookLoans = async () => {
		await axios
			.get("/dispatcher/users/" + username + "/bookloans")
			.then((response) => {
				setBookLoan(response.data);
				//console.log(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};

	const setUserGuest = () => {
		axios
			.post(
				"/dispatcher/users/guest",
				{ id: currUser.id },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			.then(() => {
				getUser();
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const setUserLibrarian = () => {
		axios
			.post(
				"/dispatcher/users/librarian",
				{ id: currUser.id },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			.then(() => {
				getUser();
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};
	const cancelReservation = async (id) => {
		//console.log(availableBooks);
		await axios
			.delete("/dispatcher/reservations", {
				headers: { "Content-Type": "application/json" },
				data: { id: id },
				withCredentials: true,
			})
			.then(setReservation(reservations.filter((p) => p[0] !== id)))
			.catch((e) => {
				console.error(e);
			});
	};
	const changeRole = () => {
		console.log(currUser);
		if (currUser?.userType === "LIBRARIAN") setUserGuest();
		else if (currUser?.userType === "GUEST") setUserLibrarian();
	};
	useEffect(() => {
		if (username === "") {
			navigate("/");
		}
		getReservations();
		getBookLoans();
		getUser();
	}, []);
	return user.userType === "LIBRARIAN" ? (
		<Container style={{ paddingTop: "8.5vh" }}>
			<Row>
				<Col>
					<Row className="col-12">
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<h1 style={{ marginTop: "4vh", marginLeft: "2vw" }}>
								Uživatel: {currUser?.username}
							</h1>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<h1 style={{ marginTop: "4vh", marginLeft: "2vw" }}>
									Role: {currUser?.userType}
								</h1>
								<Button
									style={{
										backgroundColor: "green",
										border: "none",
									}}
									onClick={() => {
										changeRole();
									}}
								>
									Změnit roli
								</Button>
							</div>
						</div>
						<h1>List rezervovaných knih:</h1>

						<Table striped bordered hover variant="dark">
							<thead>
								<tr>
									<th>#</th>
									<th>Kniha</th>
									<th>Datum rezervace</th>
									<th>Datum expirace</th>
									<th>Zrušit rezervaci</th>
									<th>Půjčit knihu</th>
								</tr>
							</thead>
							<tbody>
								{console.log(reservations)}
								{console.log(bookLoans)}
								{Array.isArray(reservations)
									? reservations?.map((r) => {
											return (
												<tr /*key={key}*/>
													<td>{i++}</td>
													<td
														style={{ cursor: "pointer" }}
														onClick={() => {
															navigate("/books/b/" + r[4]);
														}}
													>
														{r[1]}
													</td>
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
													<td>
														<Button
															style={{
																backgroundColor: "green",
																border: "none",
															}}
															onClick={() => {
																console.log(r);
																loanBook(r[0]);
															}}
														>
															Půjčit knihu
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
									<th>Vrátit knihu</th>
									{/* <th>Dní do vrácení</th> */}
								</tr>
							</thead>
							<tbody>
								{Array.isArray(bookLoans)
									? bookLoans?.map((b) => {
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
													<td>
														<Button
															style={{
																backgroundColor: "green",
																border: "none",
															}}
															onClick={() => {
																returnBook(b[0]);
															}}
														>
															Vrátit knihu
														</Button>
													</td>
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
	) : (
		<>{navigate("/")}</>
	);
}

export default User;
