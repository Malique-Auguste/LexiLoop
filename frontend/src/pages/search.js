import { useState } from 'react'

const Search = () => {
    const [word, setWord] = useState('')

    async function update_search(e) {
        e.preventDefault()

        console.log("updating search")
        const stem = "/api/search/"
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

    return (
        <div id="search-page">
            <h1 id = "title">LexiLoop</h1>
            <form id = "search-bar" onSubmit = {update_search}>
                <input type="text" 
                    name="word" 
                    id="word" 
                    placeholder="Type word here"
                    onChange={(e) => setWord(e.target.value)}/>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default Search