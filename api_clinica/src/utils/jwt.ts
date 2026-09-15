import jwt from 'jsonwebtoken'
const chaveSecreta = process.env.CHAVE_SECRETA || "";
interface Token {
    iat: number,
    exp: number
}

export function signTokenAcesso(payload: any) {
    return jwt.sign(payload, chaveSecreta, {
        expiresIn: '5Min'
    })
}

export function signTokenRefresh(payload: any) {
    return jwt.sign(payload, chaveSecreta, {
        expiresIn: '1Day'
    })
}

export function verificarToken(token: string) {
    return jwt.verify(token, chaveSecreta)
}


export function getToken(token: string): Token {
    return jwt.decode(token) as Token;
}