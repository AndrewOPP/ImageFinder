const BASIC_URL = "https://pixabay.com/api/"
const URL_KEY = "39188541-a1bd6d68f6e7210f6abdbcfe1"
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector("form")
const { searchInput } = form.elements
const gallery = document.querySelector(".gallery")
const loadMoreButton = document.querySelector(".load-more")
const finalMessage = document.querySelector(".final-message")

let pageNumber 


const fetchImgs = async (params) => {
  const response = await fetch(`${BASIC_URL}?${params}`);
  const imgs = await response.json();
  return imgs;
};  



form.addEventListener("submit", handlerFunction)

function handlerFunction(event) {

    event.preventDefault() 
    pageNumber = 1  
    const params = new URLSearchParams({
        key: URL_KEY,
        q: searchInput.value,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: 1,
        per_page: 39,
    })
        
    fetchImgs(params)
        .then(imgs => {

            if (imgs.hits.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.')
                return
            }

            gallery.innerHTML = createMarkUp(imgs.hits)
            loadMoreButton.removeAttribute("hidden")
            finalMessage.setAttribute("hidden", "true")
            Notify.success(`Hooray! We found ${imgs.totalHits} images.`)
        })
        .catch(error => console.log(error));
    
            
    }

    function createMarkUp(imgs) {
        pageNumber += 1
        const markUp = imgs.map(({downloads, comments, views, tags, webformatURL, largeImageURL, likes }) => {
    return `<div class="photo-card">
        <img src="${webformatURL}" width="600px" height="400px" alt="${tags}" loading="lazy" />
            <div class="info">
            <p class="info-item">
                <b>Likes</b>
                ${likes}
                </p>
            <p class="info-item">
                <b>Views</b>
                ${views}
                </p>
            <p class="info-item">
                <b>Comments</b>
                ${comments}
                </p>
            <p class="info-item">
                <b>Downloads</b>
                ${downloads}
                </p>
            </div>
    </div>`
    }).join("")
    return markUp
}

loadMoreButton.addEventListener("click", loadMoreFunction)


function loadMoreFunction() {
    const params = new URLSearchParams({
        key: URL_KEY,
        q: searchInput.value,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: pageNumber,
        per_page: 39,
    })


    fetchImgs(params).then(imgs => {
        if (pageNumber > imgs.totalHits / 39) {
            loadMoreButton.setAttribute("hidden", "true")
            return finalMessage.removeAttribute("hidden")
        }
        gallery.insertAdjacentHTML("beforeend",  createMarkUp(imgs.hits))
    })  
}

