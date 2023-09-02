import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import {createMarkUp} from "./js/createMarkup.js"
import axios, {isCancel, AxiosError} from 'axios';


const BASIC_URL = "https://pixabay.com/api/"
const URL_KEY = "39188541-a1bd6d68f6e7210f6abdbcfe1"
const form = document.querySelector("form")
const { searchInput } = form.elements
const gallery = document.querySelector(".gallery")
const loadMoreButton = document.querySelector(".load-more")
const finalMessage = document.querySelector(".final-message")
let pageNumber 

const fetchImgs = async (params) => {
  const response = await axios.get(`${BASIC_URL}?${params}`);
  const imgs = await response.json();
  return imgs;
};  

form.addEventListener("submit", handlerFunction)
loadMoreButton.addEventListener("click", loadMoreFunction)


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
            console.log(imgs);
            if (imgs.hits.length === 0) {
                simpleGallery.refresh()
                Notify.failure('Sorry, there are no images matching your search query. Please try again.')
                return
            }

            gallery.innerHTML = createMarkUp(imgs.hits)
            loadMoreButton.removeAttribute("hidden")
            finalMessage.setAttribute("hidden", "true")
            Notify.success(`Hooray! We found ${imgs.totalHits} images.`)
            if (40 > imgs.totalHits) {
                loadMoreButton.setAttribute("hidden", "true")
                return finalMessage.removeAttribute("hidden")
            }
        })
        .catch(error => console.log(error));
    
        setTimeout(() => {
             simpleGallery = new SimpleLightbox('.gallery a', { /* options */ });               
        }, 10)
            
    }

function loadMoreFunction() {
    pageNumber += 1
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

        if (pageNumber-1 > imgs.totalHits / 39) { 
            loadMoreButton.setAttribute("hidden", "true")
            return finalMessage.removeAttribute("hidden")
        }

        gallery.insertAdjacentHTML("beforeend", createMarkUp(imgs.hits))
        simpleGallery.refresh()

    })  
}


