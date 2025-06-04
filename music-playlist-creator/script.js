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
        card.innerHTML = `
        <img src="${playlist.playlist_art}" alt="Playlist Art">
        <h3>${playlist.playlist_name}</h3>`;

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

