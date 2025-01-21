import { useNavigate } from "react-router";

const SearchBar = () => {

    let navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        const query = e.target.query.value;

        if (query.trim() === '') return;
        navigate(`/app/search?query=${query}`);
        
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    name="query"
                    placeholder="Search..."
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default SearchBar;