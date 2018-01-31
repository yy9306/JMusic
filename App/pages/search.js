import React, {Component} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native'

import HttpMusic from '../api/api'
import isValidMusic, {createSong} from '../common/song'
import {width,height, jumpPager} from '../base/Utils'

const perpage = 20
const TYPE_SINGER = 'singer'

export default class Search extends Component{
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props)
    this.state = {
      hotData: [],
      result: [],
      txtValue: '',
      page: 1,
      opacity: 1,
      hasMore: true,
      showSinger: true,
    }
    this.HttpMusic = new HttpMusic()
    this.getHotSearch()
    this.bgColor = '#222'
  }
  
  getHotSearch() {
    this.HttpMusic.getHot()
      .then((request) => {
        if(request.code === 0) {
          this.setState({hotData: request.data.hotkey.slice(0, 10)})
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  
  changText(text) {
    this.setState({page: 1})
    this.setState({txtValue: text}, () => {
      this.HttpMusic.getSearch(this.state.txtValue, this.state.page, this.state.showSinger, perpage)
        .then((request) => {
          if(request.code === 0) {
            let ret = this._genResult(request.data)
            this.setState({result: ret})
            this._checkMore(request.data)
          }
        })
    })
  }
  
  searchMore() {
    if (!this.state.hasMore) {
      return
    }
    this.setState({page: this.state.page++}, () => {
      this.HttpMusic.getSearch(this.state.txtValue, this.state.page, this.state.showSinger, perpage).then((res) => {
        if (res.code === 0) {
          let result = this.state.result.concat(this._genResult(res.data))
          this.setState({result, result})
          this._checkMore(res.data)
        }
      })
    })
  }
  
  
  _checkMore(data) {
    const song = data.song
    if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
      this.setState({hasMore: false})
    }
  }
  
  _genResult(data) {
    let ret = []
    if (data.zhida && data.zhida.singerid && this.state.page === 1) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
    }
    if (data.song) {
      ret = ret.concat(this._normalizeSongs(data.song.list))
    }

    return ret
  }
  
  _normalizeSongs(list) {
    let ret = []
    list.forEach((musicData) => {
        ret.push(createSong(musicData))
    })
    return ret
  }
  
  getDisplayName(item, index) {
    if (item.type === TYPE_SINGER) {
      return (
        <TouchableOpacity onPress={() => {
          jumpPager(this.props.navigate, 'SingerDetail', {
            title: item.singername,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`,
            id: item.singermid
          })
        }}>
          <View style={styles.imgWrapper}>
            <Image source={require('./img/user.png')} style={{marginRight: 10, width: 14, height: 14}}/>
            <Text style={{color: 'hsla(0,0%,100%,.3)', fontSize: 14}} numberOfLines={1}
                  ellipsizeMode='tail'>{item.singername}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => {
          jumpPager(this.props.navigate, 'PlayerScence', {
            songs: this.state.result,
            currentIndex: index
          })
        }}>
          <View style={styles.imgWrapper}>
            <Image source={require('./img/music.png')} style={{marginRight: 10, width: 14, height: 14}}/>
            <Text style={{color: 'hsla(0,0%,100%,.3)', fontSize: 14}} numberOfLines={1}
                  ellipsizeMode='tail'>{`${item.name}-${item.singer}`}</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }
  
  _onEndReached() {
    this.searchMore()
  }
  
  _renderFooter() {
    if(this.state.hasMore) {
      return (
        <ActivityIndicator />
      )
    }else {
      return (
        <Text />
      )
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.InputWrapper}>
            <Image style={styles.icon_search} source={require('./img/icon_search.png')}/>
            <TextInput style={styles.textInputStyle}
                       placeholder={`搜索歌曲、歌手`}
                       placeholderTextColor={`hsla(0,0%,100%,.3)`}
                       autoFocus={true}
                       onChangeText={(text) => {
                         this.changText(text)
                       }}
                       value={this.state.txtValue}
            />
          </View>
        </View>
        <View style={styles.hotWrap}>
          <Text style={styles.hot_title}>热门搜索</Text>
          <View style={styles.hotTitleWrap}>
            {
              this.state.hotData.map((item, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => {
                    this.changText(item.k)
                  }}>
                    <View style={styles.name_tab}>
                      <Text ref='title'  style={styles.name}>{item.k}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })
            }
          </View>
          {this.state.result.length > 0 && <View style={[styles.scroll_View, {opacity: this.state.opacity}]}>
            <FlatList data={this.state.result}
                      keyExtractor={(item, index) => index}
                      showsVerticalScrollIndicator={false}
                      onEndReached={this._onEndReached.bind(this)}
                      onEndReachedThreshold={-0.1}
                      ListFooterComponent={this._renderFooter.bind(this)}
                      renderItem={({item, index}) => {
                        return (
                          <View style={{width: width, paddingBottom: 20, flex: 1}}>
                            {this.getDisplayName(item, index)}
                          </View>
                        )
                      }}/>
          </View>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    // backgroundColor: '#222',
  },
  contentWrapper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  InputWrapper: {
    width: width - 40,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 6,
    paddingRight: 6,
    height: 40,
    backgroundColor: '#333',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 3
  },
  icon_search: {
    width: 23,
    height: 23,
  },
  textInputStyle: {
    paddingLeft: 6,
    paddingRight: 6,
    flex: 1,
    height: 20,
    color: '#fff',
  },
  hotWrap: {
    position: 'relative',
    width: width,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 20,
    marginTop: 0,
    flex: 1,
  },
  hot_title: {
    fontSize: 14,
    marginBottom: 20,
    color: 'hsla(0,0%,100%,.5)'
  },
  hotTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  name_tab: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#333',
    marginBottom: 10,
    marginRight: 15,
    borderRadius: 3,
  },
  name: {
    fontSize: 14,
    color: 'hsla(0,0%,100%,.3)'
  },
  scroll_View: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
    backgroundColor: '#222',
  },
  imgWrapper: {
    flexDirection: 'row',
    flex: 1,
    width: width,
    alignItems: 'center'
  }
})