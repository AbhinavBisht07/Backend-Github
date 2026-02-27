import React, { useEffect, useRef, useState } from "react";
import { detectFace, init } from "../utils/utils";

const FaceExpression = () => {
    const videoRef = useRef(null);
    const faceLandmarkerRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Detecting...");


    useEffect(() => {

        init({faceLandmarkerRef,videoRef, streamRef});

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
            }
        };
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Emotion Detection</h2>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: "320px",
                    borderRadius: "10px",
                    transform: "scaleX(-1)",
                }}
            />

            <h2 style={{ marginTop: "15px" }}>{expression}</h2>

            <button 
            onClick={()=>{
                detectFace({faceLandmarkerRef, videoRef, setExpression});
            }}
            >Detect Expression</button>
        </div>
    );
};

export default FaceExpression;

// import React, { useEffect, useRef, useState } from "react";
// import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// const FaceExpression = () => {
//   const videoRef = useRef(null);
//   const [expression, setExpression] = useState("Loading...");
//   let faceLandmarker = null;

//   // ✅ Load MediaPipe Model
//   const loadModel = async () => {
//     const vision = await FilesetResolver.forVisionTasks(
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
//     );

//     faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
//       baseOptions: {
//         modelAssetPath:
//           "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//       },
//       outputFaceBlendshapes: true,
//       runningMode: "VIDEO",
//       numFaces: 1,
//     });

//     return faceLandmarker;
//   };

//   // ✅ Start Camera
//   const startCamera = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     videoRef.current.srcObject = stream;

//     return new Promise((resolve) => {
//       videoRef.current.onloadeddata = () => resolve();
//     });
//   };

//   // ✅ Expression Logic
//   const getExpression = (shapes) => {
//     const getScore = (name) =>
//       shapes.find((s) => s.categoryName === name)?.score || 0;

//     const smile =
//       getScore("mouthSmileLeft") + getScore("mouthSmileRight");

//     const blink = getScore("eyeBlinkLeft") + getScore("eyeBlinkRight");
//     const mouthOpen = getScore("jawOpen");
//     const browDown = getScore("browDownLeft") + getScore("browDownRight");

//     if (smile > 1.2) return "😊 Happy";
//     if (blink > 1.4) return "😉 Blinking";
//     if (mouthOpen > 0.6) return "😮 Surprised";
//     if (browDown > 1.2) return "😠 Angry";

//     return "😐 Neutral";
//   };

//   // ✅ Detect Face Loop
//   const detectFace = () => {
//     if (!faceLandmarker || !videoRef.current) return;

//     const results = faceLandmarker.detectForVideo(
//       videoRef.current,
//       performance.now()
//     );

//     if (results.faceBlendshapes?.length > 0) {
//       const shapes = results.faceBlendshapes[0].categories;
//       const exp = getExpression(shapes);
//       setExpression(exp);
//     }

//     requestAnimationFrame(detectFace);
//   };

//   useEffect(() => {
//     let landmarker;

//     const init = async () => {
//       landmarker = await loadModel();
//       faceLandmarker = landmarker;
//       await startCamera();
//       detectFace();
//     };

//     init();

//     return () => {
//       if (videoRef.current?.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Face Expression Detection</h2>

//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         style={{
//           width: "320px",
//           borderRadius: "10px",
//           transform: "scaleX(-1)", // mirror view
//         }}
//       />

//       <h3 style={{ marginTop: "15px" }}>{expression}</h3>
//     </div>
//   );
// };

// export default FaceExpression;