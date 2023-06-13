export interface Author {
    id: number
    firstName: string
    lastName: string
    birthdate: Date
    description?: string
}

export interface AuthorLookup {
    id: number
    firstName: string
    lastName: string
}