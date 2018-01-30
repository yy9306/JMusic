import { getUid } from '../common/uid'

const URL = {
  VKeyUrl: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&cid=205361747&platform=yqq&hostUin=0&needNewCode=0&uin=0`
}

export default class HttpSong {
  getVKey(songmid, filename) {
    url = `${URL.VKeyUrl}&songmid=${songmid}&filename=${filename}&guid=${getUid()}`
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
        .done()
    })
  }
}