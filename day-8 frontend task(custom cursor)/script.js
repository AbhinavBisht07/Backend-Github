// NOT OPTIMIZED CODE :-
// const mouseFollower = document.querySelector(".mouse-follower");
// const mouseFollowerSmall = document.querySelector(".mouse-follower-small");


// addEventListener("mousemove", (e)=>{
//     const { clientX, clientY } = e;

//     mouseFollower.style.top = clientY + "px"
//     mouseFollower.style.left = clientX + "px"

//     mouseFollowerSmall.style.top = clientY + "px"
//     mouseFollowerSmall.style.left = clientX + "px"

//     //ye top and left use nahi karenge ... for smooth website we would use transfom translate :- 
//     // mouseFollower.style.transform = `translate(${clientX}px, ${clientY}px)`
// })



// OPTIMIZED CODE:-
const mouseFollower = document.querySelector(".mouse-follower");
const mouseFollowerSmall = document.querySelector(".mouse-follower-small");

let x = 0, y = 0;

addEventListener("mousemove", (e)=>{
    const { clientX, clientY } = e;
    
    x = clientX;
    y = clientY;
    
})

function updatePosi(){
    mouseFollower.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    mouseFollowerSmall.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    requestAnimationFrame(updatePosi);
}
updatePosi()
