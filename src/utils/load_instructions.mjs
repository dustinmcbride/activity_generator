import fs from 'fs';


export default function parseInstructions () {
    const instructionsFilePath = process.argv[2]

    if (!instructionsFilePath) {
     console.log("\nError: Please provide path to instructions file as argument\n")
     process.exit()
    }

    let instructions = null

    try {
        instructions = JSON.parse(fs.readFileSync(instructionsFilePath, 'utf8'))
    } catch (e) {
        console.log("\nError: Could not parse instructions file\n")
        process.exit()
    }

    if (!instructions?.actions) {
        console.log("\nError: Malformed instructions file\n")
        process.exit()
    }

    return instructions.actions
}
