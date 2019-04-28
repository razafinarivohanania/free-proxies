const path = require('path');
const base64Img = require('base64-img');
const Tesseract = require('tesseract.js');
const File = require('./file');

const String = require('./string');
const Directory = require('./directory');

async function getImagePath(dataBase64) {
    const outputPath = path.resolve(__dirname, '..', 'cache');
    await Directory.createIfAbsent(outputPath);

    return {
        directory: outputPath,
        name: String.generateRandomString(20)
    }
}

function storeIntoFile(imagePath, dataBase64) {
    return new Promise((resolve, reject) => {
        base64Img.img(dataBase64, imagePath.directory, imagePath.name, (error, filePath) => {
            if (error)
                reject(error);
            else
                resolve(filePath);
        });
    });
}

/**
 * Convert data string base 64 into image
 * Read image as text
 * Remove image file
 * 
 * @param {String} 
 */
module.exports.readBase64ImageAsText = async dataBase64 => {
    let imagePath = await getImagePath(dataBase64);
    imagePath = await storeIntoFile(imagePath, dataBase64.replace('charset=utf-8;', ''));
    const result = await Tesseract.recognize(imagePath);
    await File.remove(imagePath);
    return result.text;
}