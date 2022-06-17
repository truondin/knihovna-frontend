import React, { useEffect, useMemo, useState } from "react";
import logo from "./logo.svg";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Menu from "./components/shared/Menu";
import { UserContext } from "./context/UserContext";
import Database from "./components/pages/Database";
import Users from "./components/pages/Users";
import NotFound from "./components/pages/NotFound";
import HomePage from "./components/pages/HomePage";
import Profile from "./components/pages/Profile";
import Title from "./components/pages/Title";
import Author from "./components/pages/Author";
import User from "./components/pages/User";
import NewAuthor from "./components/pages/NewAuthor";
import NewGenre from "./components/pages/NewGenre";
import DeleteAuthor from "./components/pages/DeleteAuthor";
import DeleteGenre from "./components/pages/DeleteGenre";
import NewTitle from "./components/pages/NewTitle";
import EditTitle from "./components/pages/EditTitle";

function App() {
	const [user, setUser] = useState(UserContext);
	const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
	const loadUser = () => {
		if (!user.username && sessionStorage.getItem("user") !== null) {
			setUser(JSON.parse(sessionStorage.getItem("user")));
		}
	};
	useEffect(() => {
		loadUser();
	}, []);
	return (
		<Router basename="/knihovna-frontend">
			<UserContext.Provider value={userValue}>
				<Menu />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/books" element={<Database />} />

					{user?.userType === "LIBRARIAN" ? (
						<>
							<Route path="/books/new" element={<NewTitle />} />
							<Route path="/books/edit/:isbn" element={<EditTitle />} />
							<Route path="/authors/delete" element={<DeleteAuthor />} />
							<Route path="/genres/delete" element={<DeleteGenre />} />
							<Route path="/authors/new" element={<NewAuthor />} />
							<Route path="/genres/new" element={<NewGenre />} />
							<Route path="/userlist" element={<Users />} />{" "}
						</>
					) : (
						""
					)}

					<Route path="/profile" element={<Profile />} />
					<Route path="/users/u/:username" element={<User />} />
					<Route path="/books/b/:isbn" element={<Title />} />
					<Route path="/authors/a/:id" element={<Author />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</UserContext.Provider>
		</Router>
	);
}

export default App;
