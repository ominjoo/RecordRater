$('#title').hide();
$('#finalRating').hide();
const url = new URL(window.location.href);
const albumID = url.searchParams.get('id');
console.log(albumID);

const coverURL = `https://coverartarchive.org/release/${albumID}/front`;

fetch(`https://musicbrainz.org/ws/2/release/${albumID}?inc=artist-credits+recordings&fmt=json`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
.then(response => response.json())
.then(releaseData => {
    const albumName = releaseData.title;
    console.log(albumName);
    const artistName = releaseData['artist-credit'][0].artist.name;
    console.log(artistName);

    const tracks = releaseData.media[0]?.tracks;
    let counter = 0;
    let albumRating = 0;
    let ratingClass = '';
    const ratings = [];
    const ratingClasses = [];

    $('#trackNumberName').html(`
        <p>Track ${counter + 1}: ${tracks[counter].title}</p>
    `);

    $("#next_button").click(async() => {
        counter++;
        console.log(counter);
        if(counter <= tracks.length){
            const rating = $('#dropbutton').text();
            switch (rating) {
                case 'Perfect (5)':
                    albumRating += 5;
                    ratingClass = 'rating-perfect';
                    break;
                case 'Amazing (4)':
                    albumRating += 4;
                    ratingClass = 'rating-amazing';
                    break;
                case 'Good (3)':
                    albumRating += 3;
                    ratingClass = 'rating-good';
                    break;
                case 'Okay (2)':
                    albumRating += 2;
                    ratingClass = 'rating-okay';
                    break;
                case 'Bad (1)':
                    albumRating += 1;
                    ratingClass = 'rating-bad';
                    break;
                default:
                    alert("Please select a rating for this track before proceeding!")
                    counter--;
                    return;
            }
            ratings.push(rating);
            ratingClasses.push(ratingClass);
            console.log(ratings + albumRating + ratingClass);

        } else {
            albumRating /= tracks.length;
            albumRating = albumRating.toFixed(2) * 2.0;

            displayFinalReview(tracks, albumRating, ratingClasses, albumName, artistName);
        }

        if(counter < tracks.length) {
            $('#trackNumberName').html(`
                    <p>Track ${counter + 1}: ${tracks[counter].title}</p>
            `);
            $('#dropbutton').text('Rate this track');
        } else {
            $("#heading").hide();
            $("#dropbutton").hide();
            $("#trackNumberName").hide();
            $('#next_button').html('Finish')
        }
    });

    const menu = document.getElementById('myDropdown');
    const button = document.getElementById('dropbutton');

    menu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default link behavior
            button.textContent = `${this.textContent}`;
            menu.classList.remove('show');
        });
    });

})
.catch(error => {
    console.error('Error fetching additional album data:', error);
});

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById('myDropdown').classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
        }
    }
}

function displayFinalReview(tracks, albumRating, ratingClasses, albumName, artistName) {
    $('#next_button').hide();
    let ratingsList = '';
    const colorChart = [
        '<li class="rating-block rating-perfect">Perfect</li>',
        '<li class="rating-block rating-amazing">Amazing</li>',
        '<li class="rating-block rating-good">Good</li>',
        '<li class="rating-block rating-okay">Okay</li>',
        '<li class="rating-block rating-bad">Bad</li>'
    ]; 
    $('#colorGuide').html(colorChart);
    $('#albumCover2').html(`
            <img src="${coverURL}" alt="" style="max-width: 260px;">
        `);

    $('#title').html("Album Review: <br>\"" + albumName + "\"<br>by " + artistName);
    $('#title').show();

    console.log(ratingClasses);
    tracks.forEach((track, index) => {
        console.log(ratingsList);
        ratingsList += `<li class="rating-block ${ratingClasses[index]}">${index + 1}. ${track.title}</li>`;
    });
    $('#trackRatings').html(ratingsList);
    $('#finalRating').html("Album Rating: " + albumRating + "/10");
    $('#finalRating').show();
    

    document.body.style.setProperty('--background-url', `url('${coverURL}')`);

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    body::before {
      background-image: var(--background-url); 
      background-repeat: no-repeat 
      background-position: center;
      background-size: cover;
    }
    `;
    document.head.appendChild(style);

    
}