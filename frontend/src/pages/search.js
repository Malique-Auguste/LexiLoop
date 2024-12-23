import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAppContext } from '../hooks/useAppContext'
import WordPartialDefinition from '../components/word_definition'

const Search = () => {
    const [word, setWord] = useState('')
    const {state, dispatch} = useAppContext()

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
                dispatch({type: "LOAD", payload: {model: word_model, html: new_state}})                
            })
            .catch(error => {
                console.error('Error:', error);
            }); 
    }

    async function save_word(e) {
        console.log("saving word")
        console.log(state.model)
        console.log(JSON.stringify(state.model))
        const api_call = "/api/"

        if (!state) {
            reset()
            return
        }

        fetch(api_call, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json', // Specify the content type
            },
            body: JSON.stringify(state.model)
        }).then(_ => {
            reset()
            console.log("Success")
        })
    }
    
    function reset() {
        document.getElementById("search-bar").reset()
        dispatch({type: "RESET"})
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
                <button type="button"
                    onClick={save_word}>Save</button>
            </form>
            <ol id = "WordDefinition">
                {state && state.html}
            </ol>
            <Link to="study">Study</Link>
        </div>
    )
}

export default Search