const URL = {
  discUrl: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.3049687912553909',
  bannerUrl: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  singerUrl: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq',
  rankUrl: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5',
  hotSearchUrl: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5',
  rankDetailUrl: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5',
  singerDetail: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1',
  searchUrl: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&catZhida=1&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5',
  songListUrl: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0'
}

export default class HttpMusic {
  
  getDiscUrl() {
    return new Promise((resolve, reject) => {
      fetch(URL.discUrl,{
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com',
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
  
  getBanner() {
    return new Promise((resolve, reject) => {
      fetch(URL.bannerUrl)
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
  
  getSinger() {
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
  
  getDetailSinger(singerId) {
    let url = `${URL.singerDetail}&singermid=${singerId}`
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
  
  getSearch(query,page, zhida, perpage) {
    let url = `${URL.searchUrl}&w=${encodeURIComponent(query)}&p=${page}&perpage=${perpage}&n=${perpage}`
    
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          let reg = /(callback\()/;
          let data1 = data.replace(reg, '').replace(/(\))+$/, ' ')
          resolve(JSON.parse(data1))
        })
        .catch((error) => {
          reject(error)
        })
        .done()
    })
  }
 
  getSongList(disstid) {
    let url = `${URL.songListUrl}&disstid=${disstid}`
    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'
        }
      })
        .then((response) => response.text())
        .then((data) => {
          let reg = /(jsonCallback\()/;
          let data1 = data.replace(reg, '').replace(/(\))+$/, ' ')
          resolve(JSON.parse(data1))
        })
        .catch((error) => {
          reject(error)
        })
        .done()
    })
  }
}