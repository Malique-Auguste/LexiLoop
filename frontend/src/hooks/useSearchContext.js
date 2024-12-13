import { useContext } from "react"
import { SearchContext } from "../context/search_context"


export function useSearchContext() {
    const context = useContext(SearchContext)

    if (!context) {
        throw new Error("useSearchContext can only be used from within search context")
    }

    return context
}