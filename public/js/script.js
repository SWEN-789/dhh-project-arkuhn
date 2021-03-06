const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const url = "http://localhost:5000"

document.querySelector('#talk').addEventListener('click', () => {
    recognition.start();
});
document.querySelector('#clear').addEventListener('click', () => {
    location.reload();
});


recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.log('Confidence: ' + e.results[0][0].confidence);
    console.log(text)
    text.split(' ').forEach((word,index) => {
        /* Create a word label
        */
       var newDiv = document.createElement("div"); 
       newDiv.id = word + index.toString()
       newDiv.appendChild(document.createElement("br"))
       newDiv.appendChild(document.createTextNode(word + ':   '))
       document.body.appendChild(newDiv)
       ; 
        /* Get video URL from server
        *  and embed video
        */
        const http = new XMLHttpRequest();
        const requrl = url + '/word/' + word
        http.open('GET', requrl)
        http.send();
        http.onreadystatechange=(e)=> {
            if (http.responseText && http.readyState === 4 && http.status === 200) {
                var video = document.createElement('video');
                video.src=http.responseText
                video.autoplay = true;
                video.controls = true;
                let div = document.getElementById(word + index.toString())
                div.appendChild(video)
                div.appendChild(document.createElement("br"))
            }
            console.log(http.responseText)
        }
    })
    document.getElementById("demo").innerHTML = text

    // We will use the Socket.IO here later…
});