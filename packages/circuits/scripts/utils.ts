import * as fs from 'fs'

const fileExists = (filepath: string): boolean => {
    return fs.existsSync(filepath)
}

export { fileExists }
