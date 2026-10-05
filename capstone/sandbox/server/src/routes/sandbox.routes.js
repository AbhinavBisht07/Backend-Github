import { Router } from "express";
import { createPod } from "../kubernetes/pod.js";
import { createService } from "../kubernetes/service.js";
import { createSandboxKey } from "../config/redis.js"; // import kar diya createSandboxKey wala function
// and jahan pe sandbox id create honi wale hogi(mtlb naya sandbox pod create hone wala hoga) wahan pe use kar lenge iss function ko
import { v7 as uuid } from "uuid";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import Project from "../models/project.model.js";


const router = Router();


router.post("/project", authMiddleware, async (req,res) =>{
    const { title } = req.body;

    const newProject = new Project({
        user: req.user.id,
        title
    })

    await newProject.save();

    return res.status(201).json({
        message: 'Project created successfully.',
        project: newProject
    })
})


router.post("/start", authMiddleware, async (req, res) => {
    const projectId = req.body.projectId;
    
    // Verify that the project belongs to the authenticated user
    const poject = await Project.findOne({ _id: projectId, user: req.user.id })

    if(!project) {
        return res.status(404).json({ message: 'Project not found or access denied.' })
    }

    const sandboxId = uuid();

    await Promise.all([
        createPod(sandboxId,projectId),
        createService(sandboxId),
        createSandboxKey(sandboxId) // use kar liya redis wala createSandboxKey wala function
    ]);
    // ooper pe basically kya hora hai ? ... 1st line mein Sandbox Pod create karre hain, second line mein Sandbox Service create karre hain and in third line we are creating Sandbox Key for the Redis ...

    return res.status(200).json({
        message: "Sandbox environment created successfully",
        sandboxId,
        previewUrl: `http://${sandboxId}.preview.localhost` 
    });
});


router.get('/projects', authMiddleware, async(req,res)=>{
    const projjects = await Project.find({ user: req.user.id });
    return res.status(200).json({
        message: 'Projects retrieved successfully',
        projects
    })
})


export default router;