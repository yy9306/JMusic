import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native'
  

import HttpMusic from '../api/api'
import {jumpPager, width} from '../base/Utils'


export default class Rank extends Component{
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      rankSource: []
    }
    this.bgColor = '#222'
    this.HttpMusic = new HttpMusic()
    this.requestData()
  }
  
  requestData () {
    this.HttpMusic.getRank()
      .then((request) => {
        if(request.code === 0) {
          this.setState({rankSource: request.data.topList})
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <View  style={styles.container}>
        <View style={styles.wrapper}>
          {this.state.rankSource.length > 0 && <FlatList data={this.state.rankSource}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => {
                      let reg = /(?=\:)/g
                      let imgUrl = item.picUrl.replace(reg, 's')
                      return (
                        <TouchableOpacity onPress={() => {
                          jumpPager(this.props.navigate, 'RankDetail', {
                            id: item.id
                          })
                        }}>
                          <View style={styles.rankGroup}>
                            <Image source={{uri: imgUrl}} style={styles.img}/>
                            <View style={styles.textWrap}>
                              {item.songList.map((song, i) => {
                                return (
                                  <View style={styles.innerText} key={i}>
                                    <Text  style={styles.text}>{`${i+1} ${song.songname}${song.singername}`}</Text>
                                  </View>
                                )
                              })}
                            </View>
                          </View>
                        </TouchableOpacity>
                      )
                    }}/>}

        </View>


      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  wrapper: {
    flex: 1,
    width: width,
    paddingLeft: 20,
    paddingRight: 20,
  },
  rankGroup: {
    height: 100,
    marginTop: 20,
    width: width-40,
    flexDirection: 'row',
    flex: 1,
  },
  img: {
    width: 100,
    height: 100,
  },
  textWrap: {
    paddingLeft: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  innerText: {
    height: 26,
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: 'hsla(0,0%,100%,.3)',
  }
})
