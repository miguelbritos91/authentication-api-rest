import 'dotenv/config'

export const { 
    PORT = 3000,
    SALT = 4, // production 10 - dev 4
    NODE_ENV = 'dev',
    SECRET_TOKEN = 'c>5s=cB;w?@h9<@L]%F"_[SQQ_a"B{`Rw/=5n$O#/RTyT+)OwWPiNdMDoW&z^Y@'
} = process.env