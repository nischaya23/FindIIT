import "./SearchBar.css";

const SearchBar = ({ value, onChange }) => {

	return (
		<div className="search-container">
			<input
				type="text"
				placeholder="Search for items..."
				value={value}
				onChange={onChange}
				className="search-input"
			/>
		</div>
	);
};

export default SearchBar;
