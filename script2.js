
const url = new URL(window.location.href);
const albumID = url.searchParams.get('id');
console.log(albumID);

const coverURL = `https://coverartarchive.org/release/${albumID}/front`;

fetch(`https://musicbrainz.org/ws/2/release/${albumID}?inc=recordings&fmt=json`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
.then(response => response.json())
.then(releaseData => {
    const tracks = releaseData.media[0]?.tracks;
    let counter = 0;
    const ratings = [];
    $('#trackNumberName').html(`
        <p>Track ${counter + 1}: ${tracks[counter].title}</p>
    `);

    $("#next_button").click(async() => {
        if(counter < tracks.length - 1){
            const rating = $('#dropbutton').text();
            if(rating != 'Rate this track') {
                ratings.push(rating);
                console.log(ratings);
            } else {
                alert("Please select a rating for this track before proceeding!")
            }
            counter++
            $('#trackNumberName').html(`
                <p>Track ${counter + 1}: ${tracks[counter].title}</p>
            `);

            
        } else {
            displayFinalReview();
        }
        $('#dropbutton').text('Rate this track');
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

function displayFinalReview() {
    $("#heading").hide();
    $("#dropbutton").hide();
    $("#next_button").hide();
    $("#trackNumberName").hide();

    $('#albumCover').html(`
            <img src="${coverURL}" alt="" style="max-width: 300px;">
        `);

}