import { useState } from 'react'
import { renderToString } from 'react-dom/server'

import WordPartialDefinition from '../components/word_definition'



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
                const word_definition_root = document.getElementById("WordDefinition")

                word_definition_root.replaceChildren(...
                    data.map(word_partial_definition_data => {
                        return renderToString(WordPartialDefinition(word_partial_definition_data))
                    })
                )
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
            <div id = "WordDefinition">

            </div>
        </div>
    )
}

export default Search