import { Component, PropsWithChildren } from 'react'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'
import { AtButton, AtAvatar, AtTabBar, AtIcon } from 'taro-ui'

export default class Index extends Component<PropsWithChildren> {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>

      <Swiper
      className='top'
      indicatorColor='#999'
      indicatorActiveColor='#333'
      // vertical
      circular
      indicatorDots
      autoplay>
      <SwiperItem>

      <View className='demo-text-1'>1</View>
      </SwiperItem>
      <SwiperItem>
      <View className='demo-text-2'>2</View>
      </SwiperItem>
      <SwiperItem>
      <View className='demo-text-3'>3</View>
      </SwiperItem>
      </Swiper>

      <Text>Hello world!</Text>
      <AtButton type='primary'>按钮文案</AtButton>
      <AtAvatar type='primary'></AtAvatar>

      </View>
      )
  }
}
