import React, {Component} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native'

import HttpMusic from '../api/api'
import NavBarView from '../base/NavBarView'
import Header from './header'
import {jumpPager, width} from '../base/Utils'

export default class Search extends Component{
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props)
    this.state = {
      hotData: []
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
  
  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar*/}
          {/*animated = {true}*/}
          {/*backgroundColor = {this.bgColor}*/}
          {/*barStyle = 'light-content'*/}
        {/*/>*/}
        {/*<NavBarView backgroundColor={this.bgColor}/>*/}
        {/*<Header navigation={this.props.navigation} />*/}
        <View style={styles.InputWrapper}>
          <Image style={styles.icon_search} source={require('./img/icon_search.png')}/>
          <TextInput style={styles.textInputStyle}/>
        </View>
        <View style={styles.hotWrap}>
          <Text style={styles.hot_title}>热门搜索</Text>
          <View style={styles.hotTitleWrap}>
            {
              this.state.hotData.map((item, index) => {
                return (
                  <View style={styles.name_tab} key={index}>
                    <Text style={styles.name}>{item.k}</Text>
                  </View>
                )
              })
            }
          </View>
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
  InputWrapper: {
    margin: 20,
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
  },
  hotWrap: {
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
  }
})