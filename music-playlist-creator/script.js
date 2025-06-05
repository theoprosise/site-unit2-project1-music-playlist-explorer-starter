const cardContainer = document.getElementById("playlist-cards");

fetch("data/data.json")
.then(res => res.json())
.then(data => {
    if(!data.playlists){
        cardContainer.innerHTML = "<p>No Playlists Added</p>";
        return;
    }
    data.playlists.forEach(playlist => {
        const card = document.createElement("article");
        card.className = "playlist";
        let liked = false;
        let likeCount = playlist.like_count;
        card.innerHTML = `
        <img src="${playlist.playlist_art}" alt="Playlist Art">
        <h3>${playlist.playlist_name}</h3>
        <p>${playlist.playlist_author}</p>
        <div class="like-container">
        <button class ="like-btn">
        <i class="fa-regular fa-heart"></i>
        </button>
        <span class="like-count">${likeCount}</span>
        </div>
        `;

        const likeBtn = card.querySelector(".like-btn i");
        const likeCountSpan = card.querySelector(".like-count");

        likeBtn.addEventListener("click",(e) =>{
            e.stopPropagation();

            if(!liked){
                liked = true;
                likeCount++;
                likeBtn.classList.remove("fa-regular");
                likeBtn.classList.add("fa-solid");
            }
            else{
                liked = false;
                likeCount--;
                likeBtn.classList.remove("fa-solid");
                likeBtn.classList.add("fa-regular");
            }
            likeCountSpan.textContent = likeCount;
        })

        card.addEventListener("click",() => openModal(playlist));
        cardContainer.appendChild(card);
    });
})
.catch(err => {
    console.error("Fetch Error:",err);
})


//Modal logic section

const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function openModal(playlist) {
    document.getElementById('modalTitle').innerText = playlist.playlist_name;
    document.getElementById('modalCreator').innerText = `By ${playlist.playlist_author}`;
    document.getElementById('modalImage').innerHTML = `<img src="${playlist.playlist_art}" alt="Playlist Art">`;

    const songsContainer = document.getElementById("modalSongs");
    songsContainer.innerHTML = "";

    if(Array.isArray(playlist.songs) && playlist.songs.length > 0){
    const ul = document.createElement("ul");
    ul.style.listStyleType = "disc";
    ul.style.paddingLeft = "1.2rem";

    playlist.songs.forEach(songObj => {
        const li = document.createElement("li");
        li.innerText = `${songObj.title} - ${songObj.artist} (${songObj.duration})`;
        ul.appendChild(li);
    });
    songsContainer.appendChild(ul);
    } else{
    songsContainer.innerText = "No songs found";
    }
    modal.style.display = "block";
}

