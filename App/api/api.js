const URL = {
  // mingdao: 'https://www.mingdao.com/ajaxpage/FixedData.aspx?op=loadProvince',
  bannerUrl: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  singerUrl: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq',
  rankUrl: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5',
  hotSearchUrl: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5',
  rankDetailUrl: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5'
}

export default class HttpMusic {
  getBanner() {
    return new Promise((resolve, reject) => {
      fetch(URL.bannerUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }).then((response) => response.json())
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
        .done()
    })
  }
  
  getSingerDetail() {
    return new Promise((resolve, reject) => {
      fetch(URL.singerUrl)
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
  
  getRank() {
    return new Promise((resolve, reject) => {
      fetch(URL.rankUrl)
        .then((response) => response.text())
        .then((data) => {
          let reg = /(MusicJsonCallback\()/;
          let data1 = data.replace(reg, '').replace(/(\))+$/, ' ')
          resolve(JSON.parse(data1))
        })
        .catch((error) => {
          reject(error)
        })
        .done()
    })
  }
  
  getHot() {
    return new Promise((resolve, reject) => {
      fetch(URL.hotSearchUrl)
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
  
  getRankDetail(topid) {
    let url = `${URL.rankDetailUrl}&topid=${topid}`
    
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
  // getBanner() {
  //   return new Promise((resolve, reject) => {
  //     fetch(URL.mingdao)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         resolve(data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //       .done()
  //   })
  // }
  
}