import ImageKit from '@imagekit/nodejs';
import { Config } from '../config/config.js';

const client = new ImageKit({
  privateKey: Config.IMAGEKIT_PRIVATE_KEY
});


export async function uploadFile({buffer, fileName, folder="snitch"}) {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result;
} 