/*
load page fetches json and puts into array
renderCards populates array onto site
each card has a like an edit - calls editplaylistprompt delete - calls deleteplaylist any other click opens modal

add playlist button
three prompts for name author art
promp for song in delimited fashion
put that into array of objects 
push new object into playlists w 0 likes
rendercards

edit button
same prompts but pre filled
one prefilled w delimited
parse and write to array and rendercards

delete splices array
*/
let playlists = [];

const cardContainer = document.getElementById("playlist-cards");

const detailModal = document.getElementById("playlistModal");
const detailCloseBtn = document.getElementsByClassName("close")[0];

const addPlaylistBtn = document.getElementById("add-playlist-btn");

//json to array and render
fetch("data/data.json")
.then((res) => res.json())
.then((data) => {
    if(!data.playlists){
        cardContainer.innerHTML = "<p>No Playlists Added</p>";
        return;
    }
    playlists = data.playlists.map((p) => ({
        playlistId: p.playlistId,
        playlist_name: p.playlist_name,
        playlist_author: p.playlist_author,
        playlist_art: p.playlist_art,
        like_count: p.like_count,
        songs: p.songs.slice(),
    }));
    renderCards();
})
.catch((err) => {
    console.error("Fetch Error:",err);
});

//renderCards

function renderCards() {
    cardContainer.innerHTML = "";

    if(playlists.length === 0){
        cardContainer.innerHTML = "<p>NO PLAYLISTS</p>"
        return;
    }

    playlists.forEach((playlist, index) => {

        const card = document.createElement("article");
        card.className = "playlist";

        
        card.innerHTML = `
        <img src="${playlist.playlist_art}" alt="Playlist Art">
        <h3>${playlist.playlist_name}</h3>
        <p>${playlist.playlist_author}</p>
        <div class="like-container">
        <button class ="like-btn">
        <i class="fa-regular fa-heart"></i>
        </button>
        <span class="like-count">${playlist.like_count}</span>
        </div>
        `;

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "card-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.title = "Edit Playlist";
        editBtn.innerHTML = `<i class = "fa-solid fa-pen"></i>`;
        editBtn.addEventListener("click",(e) =>{
            e.stopPropagation();
            editPlaylistPrompt(index);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Delete Playlist";
        deleteBtn.innerHTML = `<i class = "fa-solid fa-trash"></i>`;
        deleteBtn.addEventListener("click",(e) =>{
            e.stopPropagation();
            deletePlaylist(index);
        });

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        card.appendChild(actionsDiv);

        let liked = false;
        let likeCount = playlist.like_count;

        const likeBtnIcon = card.querySelector(".like-btn i");
        const likeCountSpan = card.querySelector(".like-count");

        likeBtnIcon.addEventListener("click",(e) =>{
            e.stopPropagation();

            if(!liked){
                liked = true;
                likeCount++;
                likeBtnIcon.classList.remove("fa-regular");
                likeBtnIcon.classList.add("fa-solid");
            }
            else{
                liked = false;
                likeCount--;
                likeBtnIcon.classList.remove("fa-solid");
                likeBtnIcon.classList.add("fa-regular");
            }
            playlist.like_count = likeCount;
            likeCountSpan.textContent = likeCount;
        });

        card.addEventListener("click",() => openDetailModal(playlist));
        cardContainer.appendChild(card);
    });
}

//delete playlist
function deletePlaylist(index){
    playlists.splice(index,1);
    renderCards();
}

//Modal logic section
//detailCloseBtn
//detailModal

detailCloseBtn.onclick = () => {
    detailModal.style.display = "none";
};
window.addEventListener("click", (e) => {
       if(e.target === detailModal) detailModal.style.display = "none";
});

function shuffleArray(arr){
    for(let i = arr.length-1; i >0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
}

function openDetailModal(playlist) {
    document.getElementById('modalTitle').innerText = playlist.playlist_name;
    document.getElementById('modalCreator').innerText = `By ${playlist.playlist_author}`;
    document.getElementById('modalImage').innerHTML = `<img src="${playlist.playlist_art}" alt="Playlist Art">`;

    let currentSongs = Array.isArray(playlist.songs)
    ? playlist.songs.slice()
    : [];

    const songsContainer = document.getElementById("modalSongs");
    songsContainer.innerHTML = "";

    if(currentSongs.length > 0){
        const shuffleBtn = document.createElement("button");
        shuffleBtn.id = "shuffle-btn";
        shuffleBtn.innerHTML = `<i class="fa-solid fa-shuffle"></i> Shuffle`;

        const ul = document.createElement("ul");
        ul.style.listStyleType = "disc";
        ul.style.paddingLeft = "1.2rem";

        function renderSongList(){
            ul.innerHTML = "";
            currentSongs.forEach((songObj) => {
                const li = document.createElement("li");
                li.innerText = `${songObj.title} - ${songObj.artist} (${songObj.duration})`;
                ul.appendChild(li);
            });
        }
        renderSongList();
        shuffleBtn.addEventListener("click",() => {
            shuffleArray(currentSongs);
            renderSongList();
        });


    songsContainer.appendChild(shuffleBtn);
    songsContainer.appendChild(ul);
    } else{
    songsContainer.innerText = "No songs found";
    }
    detailModal.style.display = "block";
}

//Add playlist
addPlaylistBtn.addEventListener("click", addPlaylistPrompt);

function addPlaylistPrompt() {
    const name = prompt("Enter playlist name:");
    const author = prompt("Enter author name:");
    const art = prompt("Enter artwork URL - (assets/img/playlist.png):");

    const songsRaw = prompt(
        'Enter songs (comma-separated). Format "Title|Author|1:00, Title2|Author2|2:00"'
    );

    const songsArray = songsRaw
    .split(",")
    .map((s) =>s.trim())
    .filter((s)=>s.length>0)
    .map((entry)=>{
        const parts = entry.split("|").map((p)=>p.trim());
        return{
            title: parts[0] || "",
            artist: parts[1] || "",
            duration: parts[2] || "",
        };
    })
    .filter((s) => s.title && s.artist && s.duration);

    //check for edge cases eventually - rn i am tired

    const newId = Date.now().toString();
    playlists.push({
        playlistId: newId,
        playlist_name: name.trim(),
        playlist_author: author.trim(),
        playlist_art: art.trim(),
        like_count: 0,
        songs: songsArray,
    });

    renderCards();
}

function editPlaylistPrompt(index) {
    const pl = playlists[index];

    const newName = prompt("Enter playlist name:", pl.playlist_name);
    const newAuthor = prompt("Enter author name:", pl.playlist_author);
    const newArt = prompt("Enter artwork URL - (assets/img/playlist.png):", pl.playlist_art);

    const existingSongs = pl.songs
    .map((s) => `${s.title}|${s.artist}|${s.duration}`)
    .join(", ");

    const songsRaw = prompt(
        'Enter songs (comma-separated). Format "Title|Author|1:00, Title2|Author2|2:00"',
        existingSongs
    );

    const songsArray = songsRaw
    .split(",")
    .map((s) =>s.trim())
    .filter((s)=>s.length>0)
    .map((entry)=>{
        const parts = entry.split("|").map((p)=>p.trim());
        return{
            title: parts[0] || "",
            artist: parts[1] || "",
            duration: parts[2] || "",
        };
    })
    .filter((s) => s.title && s.artist && s.duration);

    pl.playlist_name = newName.trim();
    pl.playlist_author = newAuthor.trim();
    pl.playlist_art = newArt.trim();
    pl.songs = songsArray;
    renderCards();


}

