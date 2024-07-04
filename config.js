import 'dotenv/config'

export const { 
    PORT = 3000,
    SALT = 4 // production 10 - dev 4
} = process.env
