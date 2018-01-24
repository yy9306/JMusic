import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation'


import Header from './pages/header'
import SingerDetail from './pages/singerDetail'
import PlayerScence from './pages/player/playerScence'
import RankDetail from './pages/rankDetail'
/*
* 实现跳转的栈
* */
const App = StackNavigator({

  Header: {screen: Header},
  SingerDetail: {screen: SingerDetail},
  PlayerScence: {screen: PlayerScence},
  RankDetail: {screen: RankDetail}
},{
  navigationOptions: {
    gesturesEnabled: true,
  },
  headerMode: 'none'
})

export default App
