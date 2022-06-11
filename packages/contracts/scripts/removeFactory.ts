import fs from 'fs'

const main = async () => {
    const data = fs.readFileSync('./src/contracts/index.ts', 'utf-8')

    const factoryReg = /export[\{\ A-z\_]+factory[\ \}\"\.\/A-z]+factory";\n/gi
    const factoriesReg =
        /export[\ \*A-z]+factories[\ \*A-z]+".\/factories";\n/gi
    const newData = data.replace(factoryReg, '').replace(factoriesReg, '')

    fs.writeFileSync(`./src/contracts/index.ts`, newData)

    try {
        fs.unlinkSync('./src/contracts/hardhat.d.ts')
    } catch (_) {}

    fs.rmSync('./src/contracts/factories', { recursive: true, force: true })
}

void (async () => {
    let exitCode
    try {
        exitCode = await main()
    } catch (err) {
        console.error(err)
        exitCode = 1
    }
    process.exit(exitCode)
})()
