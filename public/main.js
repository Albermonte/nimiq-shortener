let query = {};

geturl = () => {
    query.url = document.getElementById("urlinput").value;
    query.address = document.getElementById('address').value;
    query.shares = document.getElementById('shares').value;
    query.shares_mined = 0;
    saveAddress(query.address);

    if (query.shares >= 1) {
        let protocol_ok = query.url.startsWith("http://") || query.url.startsWith("https://") || query.url.startsWith("ftp://");
        if (query.url != '' && query.address != '' && protocol_ok) {
            return query.url;
        } else {
            if (query.address != '') {
                swal("Wrong url!", "Please make sure the url is correct", "error");
            } else {
                swal("Wrong Nimiq Address!", "Please make sure the address is correct", "error");
            }
            return false;
        }
    } else {
        swal("Wrong number of shares!", "Make sure the number of shares is a number higher than 0", "error");
        return false;
    }
};

shorturl = () => {
    let longurl = geturl();
    if (longurl != false) {
        axios.post('/new_url', query)
            .then(({ data }) => {
                console.log(data);
                if (data.success) {
                    let current_url = window.location.href;
                    let new_shorted = current_url + 'r#' + data.hash;
                    document.getElementById('urlinput').value = new_shorted;
                    document.getElementById('hide').style.display = 'none';
                    document.getElementById('shortenurl').innerHTML = 'Copy';
                    document.getElementById('shortenurl').setAttribute("data-clipboard-target", "#urlinput");
                    document.getElementById('shortenurl').type = 'button';
                }
                else {
                    const content = document.createElement('p');
                    content.innerHTML = 'There was an error, please try again later or contact me at <a href="https://t.me/Albermonte" style:"color: blue;">Telegram</a>\n\n';
                    swal({ content, icon: 'error' });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
};

getHelp = () => {
    swal("I'm here to help you!", "Do you want to short an URL and earn NIM at the same time?\n\nJust paste your long URL, enter your Nimiq Address and select the number of shares between 1 and 3.\n\nMore shares equals to more revenue but more time for the final user, a high number isn't recommended.\n\nOnce you have all just click the 'Short It!' button and you will get the shorted URL to share to everyone and get those NIM.\n\nHappy sharing!", "info");
};

saveAddress = (address) => {
    try {
        localStorage.setItem("@address", address);
    } catch (e) {
        console.log(e);
    }
};

getAddressFromStorage = () => {
    const address = localStorage.getItem("@address");
    if (!address) return;
    document.getElementById('address').value = address;
};

getAddressFromStorage();

chooseAddress = async () => {
    const hubApi = new HubApi('https://hub.nimiq.com');

    const options = {
        appName: 'ShortNIM',
    };
    const addressInfo = await hubApi.chooseAddress(options);
    const address = addressInfo.address;
    saveAddress(address);
    document.getElementById('address').value = address;
};

document.getElementById('addressBtn').addEventListener('click', chooseAddress);
