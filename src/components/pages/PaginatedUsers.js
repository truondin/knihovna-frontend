import React, { useEffect, useState } from "react";
import { Container, Nav, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

function PaginatedUsers({ users, itemsPerPage }) {
	//console.log(books);
	let navigate = useNavigate();
	const [promisedUsers, setUsers] = useState(users);
	// We start with an empty list of items.
	const [currentItems, setCurrentItems] = useState(null);
	const [pageCount, setPageCount] = useState(0);
	// Here we use item offsets; we could also use page offsets
	// following the dispatcher or data you're working with.
	const [itemOffset, setItemOffset] = useState(0);
	useEffect(() => {
		setUsers(users);
	}, [users]);
	useEffect(() => {
		// Fetch items from another resources.
		const endOffset = itemOffset + itemsPerPage;
		setCurrentItems(promisedUsers.slice(itemOffset, endOffset));
		setPageCount(Math.ceil(promisedUsers.length / itemsPerPage));
	}, [itemOffset, itemsPerPage, promisedUsers]);

	// Invoke when user click to request another page.
	const handlePageClick = (event) => {
		const newOffset = (event.selected * itemsPerPage) % promisedUsers.length;
		window.scrollTo(0, 0);
		setItemOffset(newOffset);
	};

	return (
		<>
			<Container className="books">
				{currentItems != null
					? currentItems.map((user) => {
							return (
								<Row
									className="book"
									onClick={() => {
										navigate("/users/u/" + user.username);
									}}
								>
									<div>
										<h5>{user.id + "  " + user.username}</h5>
									</div>
									<div className="details">
										<h5>{user.userType}</h5>
									</div>
								</Row>
							);
					  })
					: ""}
			</Container>
			<Row style={{ marginTop: "15px", justifyContent: "center" }}>
				<ReactPaginate
					className="paginate"
					breakLabel="..."
					nextLabel=">"
					onPageChange={handlePageClick}
					pageRangeDisplayed={5}
					pageCount={pageCount}
					previousLabel="<"
					renderOnZeroPageCount={null}
				/>
			</Row>
		</>
	);
}
export default PaginatedUsers;
