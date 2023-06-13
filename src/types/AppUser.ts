export interface AppUser {
    id: number
    firstname: string
    lastname: string
    email: string
}

export interface UserLogin {
    email: string
    password: string
}

export interface UserTokens {
    access_token: string
    refresh_token: string
}

