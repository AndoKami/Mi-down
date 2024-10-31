import pkg from "nayan-media-downloader";
import { createSpinner } from "nanospinner";
import * as rdm from "randomstring";
import * as https from 'https';
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const { ndown, ytdown } = pkg;

const downloadDir = path.join(os.homedir(), 'Downloads');

async function fetchData(choice, url) {
    switch (choice.toLowerCase()) {
        case "instagram":
        case "facebook":
            return await ndown(url);
        case "youtube":
            return await ytdown(url);
        default:
            console.error("Please select a valid option.");
            return null;
    }
}

function downloadFile(result, downloadPath) {
    const downloadLoader = createSpinner("Just wait a little bit ...").start();
    const downloadLink = result.data[0] ? result.data[0].url : result.data.video;
    const fileName = `${result.data.title || rdm.generate()}.mp4`;
    const filePath = path.join(downloadPath, fileName);

    https.get(downloadLink, (res) => {
        const writeStream = fs.createWriteStream(filePath);
        res.pipe(writeStream);
        writeStream.on("finish", () => {
            writeStream.close();
            downloadLoader.success({ text: `go check u'r files , it's in : '${downloadPath}'` });
            process.exit(0);
        });
    }).on('error', (err) => {
        downloadLoader.error({ text: "something is not working well ..." });
        process.exit(1);
    });
}

export async function downloader(choice, url, downloadPath = downloadDir) {
    const retriveLoader = createSpinner("'m checking data of u'r vids'").start();
    const result = await fetchData(choice, url);

    if (result) {
        retriveLoader.success({ text: "It's done, go check your download files" });
        downloadFile(result, downloadPath);
    } else {
        retriveLoader.error({ text: url.length < 1 ? "You didn't insert anything" : result.msg });
        process.exit(1);
    }
}
