import { createContext, useReducer } from 'react'
import WordPartialDefinition from "../components/word_definition"

export const SearchContext = createContext()

export function searchReducer(state, action) {
    switch (action.type) {
        case "LOAD_SEARCH_RESULT":
            return {
                "state": action.payload
            }
    
        default:
            return state
    }
}

export const SearchContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(searchReducer, {
        "state": null
    })

    return (
        <SearchContext.Provider value={{ ...state, dispatch}}>
            { children }
        </SearchContext.Provider>
    )
}