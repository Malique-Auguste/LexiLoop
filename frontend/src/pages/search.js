import { useState } from 'react'
import { useSearchContext } from '../hooks/useSearchContext'
import WordPartialDefinition from '../components/word_definition'

const Search = () => {
    const [word, setWord] = useState('')
    const {state, dispatch} = useSearchContext()

    async function update_search(e) {
        e.preventDefault()

        console.log("updating search")
        const stem = "/api/search/"
        const api_call = stem + word

        fetch(api_call)
            .then(response => {
                console.log("fetching")
                if (response.ok) {
                    return response.json()
                }
                else {
                    throw new Error("Word not found");
                }
            }) 
            .then(word_model => {
                const {meanings_list} = word_model

                const new_state = meanings_list.map(word_partial_definition_data => {
                    return WordPartialDefinition(word_partial_definition_data)
                })
                console.log("new", new_state)
                dispatch({type: "LOAD_SEARCH_RESULT", payload: {model: word_model, html: new_state}})                
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
            <ol id = "WordDefinition">
                {state && state.html}
            </ol>
        </div>
    )
}

export default Search