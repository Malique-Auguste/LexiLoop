const Search = () => {
    return (
        <div id="search-page">
            <h1 id = "title">LexiLoop</h1>
            <form id = "search-bar" action = "update_search">
                <input type="text" name="word" id="word" placeholder="Type word here"/>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

function update_search(word) {
    console.log("a")
    const stem = "https://api.dictionaryapi.dev/api/v2/entries/en/"
    const api_call = stem + word

    fetch(api_call)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error("Word not found");
            }
        }) 
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
}

export default Search