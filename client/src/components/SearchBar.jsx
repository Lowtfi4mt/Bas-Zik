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
        <div >
            <form onSubmit={handleSearch} className="search-bar-div">
                <input className="search-bar-input"
                    type="text"
                    name="query"
                    placeholder="Rechercher..."
                />
                <button className="search-bar-button" type="submit">Rechercher</button>
            </form>
        </div>
    );
};

export default SearchBar;