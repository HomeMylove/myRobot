const axios = require('axios')

let url = `https://api.uomg.com/api/rand.img1?sort=二次元&format=json`

url = encodeURI(url)

axios.get(url).then(response => {

    console.log(response);


    return
    const imgUrl = response['data']['imgurl']

    res.sendMsg({
        groupId,
        imgUrl
    })
}).catch(error => {
    console.log(error)
    res.sendMsg({
        groupId,
        msg: '好像出了点儿问题'
    })
    console.error(error);
})