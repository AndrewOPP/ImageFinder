 export function createMarkUp(imgs) {
        
        const markUp = imgs.map(({downloads, comments, views, tags, webformatURL, largeImageURL, likes }) => {
    return `<div class="photo-card">
        <a href= "${largeImageURL}"><img src="${webformatURL}" class="photo" width="600px" height="400px" alt="${tags}" loading="lazy" /></a>
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