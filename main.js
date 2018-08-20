let endpoint = "https://www.jsonstore.io/394221034bda266cb95edd70c9932b3b930aaa60628853dc31131f864cbd835c";
let query = {}

geturl = () => {
    query.url = document.getElementById("urlinput").value
    query.address = document.getElementById('addrress').value
    console.log(query)
    let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://");
    if (!protocol_ok) {
        newurl = "http://" + query.url;
        return newurl;
    } else {
        return query.url;
    }
}

getrandom = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

genhash = () => {
    if (window.location.hash == "") {
        window.location.hash = getrandom();
    }
}

send_request = () => {
    fetch(endpoint + "/" + window.location.hash.substr(1), {
        method: 'POST',
        body: JSON.stringify(query),
        headers:{
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response));
}

shorturl = () => {
    let longurl = geturl();
    genhash();
    send_request(longurl);
}

let hashh = window.location.hash.substr(1)


if (window.location.hash != "") {
    console.log('Hash: ' + hashh)
    fetch(endpoint + "/" + hashh)
        .then(res => res.json())
        .then(json => {
            console.log(json.result)
        })

    /*         if (data != null) {
                window.location.href = data;
            }
     */
}