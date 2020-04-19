let query = {}
const socket = io('https://albermonte.now.sh',
    {
        transports: ['websocket']
    } 
);

socket.on('connect', () => {
    console.log(socket.connected); // true
});

geturl = () => {
    query.url = document.getElementById("urlinput").value
    query.address = document.getElementById('address').value
    query.shares = document.getElementById('shares').value
    query.shares_mined = 0
    query.id = socket.id
    if (query.shares <= 3 && query.shares >= 1) {
        let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://")
        if (query.url != '' && query.address != '' && protocol_ok) {
            return query.url;
        } else {
            if (query.address != '') {
                swal("Wrong url!", "Please make sure the url is correct", "error");
            } else {
                swal("Wrong Nimiq Address!", "Please make sure the address is correct", "error");
            }
            return false
        }
    } else {
        swal("Wrong number of shares!", "Make sure the number of shares is a number between 1 and 3", "error");
        return false
    }
}

shorturl = () => {
    if (socket.connected) {
        let longurl = geturl();
        if (longurl != false) {
            console.log(query.id)
            socket.emit('new_url', query)
        }
    } else {
        swal("Server Error!", "Cannot connect to the server, try again later", "error");

    }
}

socket.on('success', (hash) => {
    let current_url = window.location.href
    let new_shorted = current_url + 'r#' + hash
    document.getElementById('urlinput').value = new_shorted
    document.getElementById('hide').style.display = 'none'
    document.getElementById('shortenurl').innerHTML = 'Copy'
    document.getElementById('shortenurl').setAttribute("data-clipboard-target", "#urlinput")
    document.getElementById('shortenurl').type = 'button'
})

getHelp = () => {
    swal("I'm here to help you!", "Do you want to short an URL and earn NIM at the same time?\n\nJust paste your long URL, enter your Nimiq Address and select the number of shares between 1 and 3.\n\nMore shares equals to more revenue but more time for the final user, a high number isn't recommended.\n\nOnce you have all just click the 'Short It!' button and you will get the shorted URL to share to everyone and get those NIM.\n\nHappy sharing!", "info");
}