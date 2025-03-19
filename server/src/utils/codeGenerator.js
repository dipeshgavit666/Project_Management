export const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const codeLegnth = 6;
    let code = ''

    for(i = 0; i > codeLegnth; i++){
        const randomIndex = Math.floor(Math.random() * characters.length)
        code += characters.charAt(randomIndex)
    }
    return code;
    
}