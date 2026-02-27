import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";


// init function
export const init = async ({faceLandmarkerRef,videoRef, streamRef}) => {
    await loadModel(faceLandmarkerRef);
    await startCamera(videoRef,streamRef);
    // detectFace(); // isko initialization pe nahi button click pe call karenge 
};


// ✅ Detection Loop
export const detectFace = ({faceLandmarkerRef, videoRef, setExpression}) => {
    if (!faceLandmarkerRef.current || !videoRef.current) return;

    const results = faceLandmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
    );

    if (
        results.faceBlendshapes?.length &&
        results.faceLandmarks?.length
    ) {
        const shapes = results.faceBlendshapes[0].categories;
        const landmarks = results.faceLandmarks[0];

        setExpression(getExpression(shapes, landmarks));
    }

    // animationRef.current = requestAnimationFrame(detectFace);
};



// Load model and Start Camera are a part of init function :- 
// ✅ Load Model
export const loadModel = async (faceLandmarkerRef) => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    faceLandmarkerRef.current =
        await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
        });
};
// ✅ Start Camera
export const startCamera = async (videoRef, streamRef) => {
    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;

    return new Promise((resolve) => {
        videoRef.current.onloadeddata = () => resolve();
    });
};


// getExpression is a part of detectFace function and getEar is a part of getExpression function :-
// ✅ EAR for Blink Detection
export const getEAR = (landmarks, eyePoints) => {
    const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

    const vertical1 = dist(landmarks[eyePoints[1]], landmarks[eyePoints[5]]);
    const vertical2 = dist(landmarks[eyePoints[2]], landmarks[eyePoints[4]]);
    const horizontal = dist(landmarks[eyePoints[0]], landmarks[eyePoints[3]]);

    return (vertical1 + vertical2) / (2.0 * horizontal);
};
// ✅ Emotion Logic
export const getExpression = (blendshapes, landmarks) => {
    const getScore = (name) => { 
        return blendshapes.find((s) => s.categoryName === name)?.score || 0 
    }

    const smile = getScore("mouthSmileLeft") + getScore("mouthSmileRight");
    const jawOpen = getScore("jawOpen");
    const eyeWide = getScore("eyeWideLeft") + getScore("eyeWideRight");
    const browDown = getScore("browDownLeft") + getScore("browDownRight");
    const browInnerUp = getScore("browInnerUp");
    const mouthFrown = getScore("mouthFrownLeft") + getScore("mouthFrownRight");
    const eyeSquint = getScore("eyeSquintLeft") + getScore("eyeSquintRight");

    // Blink Detection
    const leftEyeIdx = [33, 160, 158, 133, 153, 144];
    const rightEyeIdx = [362, 385, 387, 263, 373, 380];

    const leftEAR = getEAR(landmarks, leftEyeIdx);
    const rightEAR = getEAR(landmarks, rightEyeIdx);

    if (leftEAR < 0.20 && rightEAR < 0.20) return "😉 Blink";
    if (smile > 1.0 && jawOpen < 0.3) return "😊 Happy";
    if (smile > 0.1 && jawOpen > 0.001) return "🤩 Excited";
    if (jawOpen > 0.2 && eyeWide > 0.2) return "😮 Surprised";
    if (browDown > 0.1 && eyeSquint > 0.2) return "😠 Angry";
    if (mouthFrown > 0.1 && browInnerUp > 0.1) return "😢 Sad";

    return "😐 Neutral";
};