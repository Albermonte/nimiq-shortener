getHelp = () => {
    swal("I'm here to help you!", "Do you want to short an URL and earn NIM at the same time?\n\nJust paste your long URL, enter your Nimiq Address and select the number of shares between 1 and Infinity.\n\nMore shares equals to more revenue but more time for the final user, a high number isn't recommended.\n\nOnce you have all just click the 'Short It!' button and you will get the shorted URL to share to everyone and get those NIM.\n\nHappy sharing!", "info");
};

statistics = () => {
    let url = document.getElementById('urlinput').value;
    if (url.startsWith("http://") || url.startsWith("https://")) {
        let hash = url.split("#").pop();
        axios.get(`/statistics/${hash}`)
            .then(({ data }) => {
                document.getElementById('form-to-hide').style.display = 'none';
                document.getElementById('hide').style.display = 'block';
                document.getElementById('shares_mined').innerHTML = data.statistics_answer.shares_mined || 0;
                document.getElementById('total_users').innerHTML = Math.round(data.statistics_answer.shares_mined / data.statistics_answer.shares) || 0;
            })
            .catch(err => swal("Wrong URL", `That URL doesn't exist, double check it. Error: ${err}`, "error"));
    } else if (url == '') {
        swal("Wrong URL", "Input an URL starting with 'http://' or 'https://'", "error");
    } else {
        swal("Wrong URL", "Check that the URL starts with 'http://' or 'https://'", "error");
    }
};
