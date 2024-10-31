import inquirer from "inquirer";
import gradient from "gradient-string";
import figlet from "figlet";
import { downloader } from "./downloader.js";
import * as os from "os";
import * as path from "path";

const goSleep = (duration = 100) => new Promise(resolve => setTimeout(resolve, duration));
const downloadDir = path.join(os.homedir(), 'Downloads');

export async function welcome() {
    const welcomeMessage = "Mi-down";
    
    figlet(welcomeMessage, (err, data) => {
        if (err) {
            console.error("Error generating welcome message:", err);
            return;
        }
        console.log(gradient.pastel.multiline(data));
    });

    await goSleep();

    console.log(`
In this CLI, you'll be able to download videos from your social network easily.
    `);
}

export async function mediaChoice() {
    const platformChoice = await inquirer.prompt({
        name: "Platform",
        type: "list",
        message: "Select the platform:",
        choices: ["Facebook", "Instagram", "TikTok", "(exit)"],
    });

    if (platformChoice.Platform === "(exit)") {
        process.exit(0);
    }

    const linkPrompt = await inquirer.prompt({
        name: "link",
        type: "input",
        message: "Enter URL:",
    });

    const pathPrompt = await inquirer.prompt({
        name: "path",
        type: "input",
        message: "Enter the path of download:",
        default: downloadDir,
    });

    downloader(platformChoice.Platform, linkPrompt.link, pathPrompt.path);
}
