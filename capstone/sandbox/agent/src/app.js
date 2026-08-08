import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";

// workspace hi humari working directory rahegi .. kyuki workspace hi ek esa folder rahega jo humare VITE ke dev container and humare agent ke container, dono ke beech mein common hone waala hai ..
const WORKING_DIR = '/workspace';


const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello from sandbox agent",
        status: "Success!"
    })
});


/**
 * @route GET /list-files
 * @description Lists all files in the working directory and its subdirectiories. Returns a JSON object with the file paths relative to the working directory. Also excluding directories like node_modules, .git, dist, etc.
 * - example:- 
 * {
    "files": [
        "file1.txt",
        "src/file2.txt",
        "src/subdir/file3.txt"
     ]
    }
 */
app.get("/list-files", async (req, res) => {
    const listFiles = async (dir, baseDir) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        const files = [];

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);

            //  Exclude certain directories :-
            if (entry.isDirectory() && ['node_modules', '.git', 'dist'].includes(entry.name)) {
                continue;
            }

            if (entry.isDirectory()) {
                files.push(...await listFiles(fullPath, baseDir));
            } else {
                files.push(relativePath);
            }
        }
        return files;
    }

    try {
        const files = await listFiles(WORKING_DIR, WORKING_DIR);
        res.status(200).json({
            message: "Files in working directory",
            files
        });
    } catch (err) {
        res.status(500).json({
            message: `Error listing files: ${err.message}`,
            status: 'Error',
        })
    }
})

/**
 * @route GET /read-files
 * @description Read the contents of all files in the query parameter 'files' and return their contents as a JSON object.
 * - example:-  /read-files?files=file1.txt,file2.txt
 */
app.get("/read-files", async (req, res) => {
    const files = req.query.files;

    if (!files) {
        return res.status(400).json({
            message: "No files specified in query parameter 'files'",
            status: "Error"
        })
    }

    const fileList = files.split(',');

    const results = await Promise.all(fileList.map(async (file) => {
        const filePath = path.join(WORKING_DIR, file);
        try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            return {
                [filePath.replace(WORKING_DIR, '')]: content
            }
        } catch (error) {
            return {
                [filePath.replace(WORKING_DIR, '')]: `Error reading file: ${error.message}`
            }
        }
    }));

    res.status(200).json({
        message: 'File contents',
        files: results
    })
})


/**
 * @route PATCH /update-files
 * @description Update the contents of files specified in the request body. The request body should contain a property 'updates' with a JSON array of objects, where each object should have a 'file' property specifying the file path(relative to WORKING_DIR) and a 'content' property specifying the new content for that file.
 */
app.patch("/update-files", async (req, res) => {

    const updates = req.body.updates;

    console.log("=================================");
    console.log("PATCH /update-files received");
    console.log("Number of files:", updates?.length);
    console.log("=================================");

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message: 'Invalid request body. Expected a JSON object with an "updates" property containing an array of file upates.',
            status: "Error"
        })
    }

    const results = await Promise.all(updates.map(async (update) => {
        const { file, content } = update;
        const filePath = path.join(WORKING_DIR, file);

        try {

            // create parent directories if they don't exist
            const dir = path.dirname(filePath);
            await fs.promises.mkdir(dir, { recursive: true });

            // NEW LOG
            console.log("Writing:", filePath);

            await fs.promises.writeFile(filePath, content, "utf-8");

            // NEW LOG
            console.log("Finished:", filePath);

            return {
                [filePath]: "File updated successfully",
            };

        } catch (err) {
            console.error("=================================");
            console.error("Error writing:", filePath);
            console.error(err);
            console.error("=================================");

            return {
                [filePath]: `Error updating file: ${err.message}`,
            };
        }
    }));

    // NEW LOG
    console.log("Sending PATCH response...");

    res.status(200).json({
        message: 'File update results',
        results,
    })
})


/**
 * @route POST /create-files
 * @description Creates new files with the content specified in the request body. The request body should contain a property 'files' with a JSON Array of objects, each object should have a 'file' property specifiying the file path (relative to the working directory) and a 'content'  property specifying the content for the new file.
 */
app.post("/create-files", async (req, res) => {
    const files = req.body.files;

    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: "Invalid request body. Expected a JSON Array of objects with 'file' and 'content' as properties of each object.",
            status: "error"
        })
    }

    const results = await Promise.all(files.map(async (fileObj) => {
        const { file, content } = fileObj;
        const filePath = path.join(WORKING_DIR, file);
        try {
            // for creating folders if for example request has /src/index.html .. src being our folder will be created (if no folder is mentioned then nothing will happen and code will move to the fiile creating line):-
            const dir = path.dirname(filePath); // this dir is nothing but our folder(src in this case)
            await fs.promises.mkdir(dir, { recursive: true });
            // then this is for normally creating files :-
            await fs.promises.writeFile(filePath, content, 'utf-8');

            return {
                [filePath]: "File created successfully",
            }
        } catch (err) {
            return {
                [filePath]: `Error creating file: ${err.message}`,
            }
        }
    }))

    res.status(200).json({
        message: 'File creation results',
        results,
    })
})


export default app;