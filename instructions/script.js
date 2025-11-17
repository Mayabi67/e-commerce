// random public compression socks video
// (you can replace with specific link later if you want)
// const videoContainer = document.getElementById("videoContainer");

// const videoID = "nNbmNuzIO98"; // chosen random helpful instructional video

// videoContainer.innerHTML = `
//   <iframe
//     src="https://www.youtube.com/embed/${videoID}"
//     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//     allowfullscreen
//   ></iframe>
// `;

// https://www.youtube.com/watch?v=nNbmNuzIO98

const videoContainer = document.getElementById("videoContainer");

videoContainer.innerHTML = `
  <video width="80%" height="400" controls>
    <source src="socks.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
`;

let sliderIndex = 0;

function slide(direction) {
    const sliderTrack = document.querySelector('.slider-track');
    const items = sliderTrack.children;
    const itemWidth = items[0].offsetWidth;
    const containerWidth = sliderTrack.parentElement.offsetWidth;
    const totalItems = items.length;
    const totalWidth = itemWidth * totalItems;
    const maxSlide = Math.ceil(totalWidth / containerWidth) - 1;

    if (direction === -1 && sliderIndex > 0) {
        sliderIndex--;
    } else if (direction === 1 && sliderIndex < maxSlide) {
        sliderIndex++;
    }

    const transformValue = -(sliderIndex * containerWidth);
    sliderTrack.style.transform = `translateX(${transformValue}px)`;
}

function autoSlide() {
    const sliderTrack = document.querySelector('.slider-track');
    const itemWidth = sliderTrack.children[0].clientWidth;
    const totalItems = sliderTrack.children.length;

    sliderIndex++;

    if (sliderIndex >= totalItems) {
        sliderIndex = 0;
    }
    
    sliderTrack.style.transform = `translateX(-${itemWidth * sliderIndex}px)`;
}

setInterval(autoSlide, 3000); // scroll every 3 seconds
