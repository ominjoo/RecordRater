
const url = new URL(window.location.href);
const albumID = url.searchParams.get('id');
console.log(albumID);


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

    $('#trackNumberName').html(`
        <p>Track ${counter + 1}: ${tracks[counter].title}</p>
    `);

    $("#next").click(async() => {
        if(counter < tracks.length){
            $('#trackNumberName').html(`
                <p>Track ${counter + 1}: ${tracks[counter].title}</p>
            `);
            counter++
        } else {
            alert("end of album");
        }

    });
    counter++;

})
.catch(error => {
    console.error('Error fetching additional album data:', error);
});
