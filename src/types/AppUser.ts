export interface AppUser {
    id: number
    firstName: string
    lastName: string
    email: string
    token: string
    roles: string[]
}

export interface UserLogin {
    username: string
    password: string
}

export interface UserAuthenticationResponse {
    error: boolean
    access_token: string
    message: string
    roles: string[]
}

