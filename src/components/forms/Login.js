import React, { useContext } from "react";
import {
	Modal,
	Button,
	Form,
	Row,
	Col,
	InputGroup,
	FormControl,
	Feedback,
} from "react-bootstrap/";
import { useState, useEffect } from "react";
import "./Register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Register from "./Register";
import { UserContext } from "../../context/UserContext";
import axios from "../../connection/axios";
import { useNavigate } from "react-router-dom";
const LOGIN_URL = "/dispatcher/users/login";

//todo you can go from login to register but not back, then there is infinite loop because
// it creates new components again and again instead of just reference

function Login(props) {
	const buttonStyle = {
		color: "white",
	};
	const navigate = useNavigate();
	const { user, setUser } = useContext(UserContext);

	const [passwordShown, setPasswordShown] = useState(false);

	const [registerModalShow, setRegisterModalShow] = React.useState(false); //register
	const closeAndOpen = () => {
		props.onHide();
		props.onSwap();
	};

	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	const form_submit = () => {
		document.getElementById("search_form").submit();
	};

	//validation:
	const initialValues = { username: "", email: "", password: "" };
	const [formValues, setFormValues] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmit(true);

		try {
			let logged = true;
			const response = await axios
				.post(
					LOGIN_URL,
					{ username: formValues.username, password: formValues.password },
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
					}
				)
				.catch((e) => {
					if (!e?.response) {
						setFormErrors({ password: "No server response." });
					} else {
						logged = false;
						if (e.response?.status === 409) {
							setFormErrors({ password: "Wrong username or password." });
						}
					}
				});

			if (logged) {
				const u = await axios
					.get("dispatcher/users/current", {
						withCredentials: true,
					})
					.then((resp) => {
						setUser(resp.data);
						sessionStorage.setItem("user", JSON.stringify(resp.data));
						console.log("user logged in " + JSON.stringify(resp.data));
					})
					.catch((e) => {
						console.log("Somethings wrong");
					});
				props.onHide();
				navigate("/");
			}
		} catch (err) {
			console.log(1);
		}
	};

	useEffect(() => {
		//console.log(formErrors);
		if (Object.keys(formErrors).length === 0 && isSubmit) {
			setIsSubmit(false);
			setFormValues({ username: "", email: "", password: "" });
		}
	}, [formErrors]);

	const validate = (values) => {
		const errors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;

		//todo check if user exists with given username and password in database

		//password
		if (!values.password) {
			errors.password = "Password is required";
		} else if (values.password.length < 8) {
			errors.password = "Password must be more than 7 characters";
		} else if (values.password.length > 20) {
			errors.password = "Password cannot exceed more than 20 characters";
		} else if (!passwordRegex.test(values.password)) {
			errors.password =
				"This is not a valid password format! Minimum 8 characters, atleast 1 uppercase letter, atleast 1 lowercase letter, atleast 1 number, atleast 1 special character";
		}
		//username
		if (!values.username) {
			errors.username = "Username is required!";
		} else if (values.username.length < 3) {
			errors.username = "Username must be more than 3 characters";
		}
		return errors;
	};

	return (
		<>
			<Modal
				{...props}
				size="xl"
				aria-labelledby="contained-modal-title-vcenter"
			>
				<Modal.Header closeButton style={{ alignItems: "flex-start" }}>
					<Modal.Body className="headerText">
						{Object.keys(formErrors).length === 0 && isSubmit ? (
							<>{<div className="success">Logged in successfully</div>}</>
						) : (
							"Login"
						)}
					</Modal.Body>
				</Modal.Header>

				<Modal.Body>
					<Form onSubmit={handleSubmit} id="modal-details">
						<Form.Group as={Row} className="mb-3" controlId="formUsername">
							<Form.Label column sm="2">
								Username
							</Form.Label>
							<Col sm="9">
								<Form.Control
									type="text"
									name="username"
									placeholder="username"
									value={formValues.username}
									onChange={handleChange}
								/>
								<p>{formErrors.username}</p>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3" controlId="formPassword">
							<Form.Label column sm="2">
								Password
							</Form.Label>

							<Col sm="9">
								<InputGroup className="mb-3">
									<Form.Control
										//aria-describedby="basic-addon2"
										type={passwordShown ? "text" : "password"}
										placeholder="Password"
										name="password"
										value={formValues.password}
										onChange={handleChange}
									/>
									<Button
										onClick={togglePassword}
										style={{
											background: "transparent",
											color: "black",
										}}
										variant="outline-dark"
										type="button"
										className="eye"
									>
										{passwordShown ? <FaEyeSlash /> : <FaEye />}
									</Button>
								</InputGroup>
								<p>{formErrors.password}</p>
							</Col>
						</Form.Group>

						<Row>
							<Col xs={2}></Col>
							<Col xs={9}>
								<div className="d-grid gap-2">
									<Button
										variant="primary"
										type="submit"
										className="btn btn-outline-dark btn-secondary"
										style={buttonStyle}
										size="lg"
										onClick={handleSubmit}
									>
										Login
									</Button>
								</div>
							</Col>
						</Row>
						<Row>
							<Col xs={2}></Col>
							<Col xs={9}>
								<div
									style={{
										display: "flex",
										textAlign: "left",
										justifyContent: "left",
										paddingTop: "15px",
									}}
								>
									New?
									<div className="swapSign" onClick={closeAndOpen}>
										Sign up - it's FREE!
									</div>
								</div>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default Login;
