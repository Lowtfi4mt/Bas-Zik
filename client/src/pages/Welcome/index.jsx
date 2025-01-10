import './style.css';

export function Welcome(setLogedIn, handleFileUpload) {
    return (
        <div>
			<button onClick={() => setLogedIn(true)}>Profil invité</button>
			<input type="file" onChange={(e) => handleFileUpload(e)} />
		</div>
    )
}