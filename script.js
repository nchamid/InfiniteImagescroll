let API_LIST_IMAGE_PAGE = 1;
let API_LIST_IMAGE_COUNT = 30;
let IMAGES_LOADED = 0;
let READY_TO_LOAD_NEXTIMAGES = false;

// Check if all images were loaded
function imageLoaded() {
  IMAGES_LOADED++;
  if (IMAGES_LOADED === API_LIST_IMAGE_COUNT) {
    const LOADER = getElementFromHTML("loader");
    LOADER.hidden = true;
    READY_TO_LOAD_NEXTIMAGES = true;
  }
}

// Helper function - To get HTML elements
function getElementFromHTML(elementID) {
  return document.getElementById(elementID);
}

// Helper function - Set Attributes to HTML Element
function setElementAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Display Photos
function displayPhotos(photos) {
  // RESET IMAGES_LOADED COUNTER
  IMAGES_LOADED = 0;
  const imageContainer = getElementFromHTML("image-container");
  //   Create <a> tag, Create <img> tag, Append <img> inside <a> tag
  photos.forEach((photo) => {
    const item = document.createElement("a");
    setElementAttributes(item, {
      href: photo.url,
      target: "_blank",
    });

    const img = document.createElement("img");
    setElementAttributes(img, {
      src: photo.download_url,
      alt: photo.author,
      title: photo.author,
    });

    // Event Listener - Check when each image is finished loading
    img.addEventListener("load", imageLoaded);

    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get Photos
async function getPhotos(imagesPage, imagesCount) {
  //PICSUM API
  const picsumAPI = `https://picsum.photos/v2/list?page=${imagesPage}&limit=${imagesCount}`;
  try {
    const apiData = await fetch(picsumAPI);
    const jsonData = await apiData.json();
    displayPhotos(jsonData);
  } catch (error) {
    alert("Something went wrong, " + error);
  }
}

// If scroll near to bottom of page, load more photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    READY_TO_LOAD_NEXTIMAGES
  ) {
    READY_TO_LOAD_NEXTIMAGES = false;
    API_LIST_IMAGE_PAGE++;
    getPhotos(API_LIST_IMAGE_PAGE, API_LIST_IMAGE_COUNT);
  }
});

getPhotos(API_LIST_IMAGE_PAGE, API_LIST_IMAGE_COUNT);
