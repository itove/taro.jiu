import { Component, PropsWithChildren } from 'react'
import './index.scss'
import Taro from '@tarojs/taro'
import { Env } from '../../env/env'
import { Taxon } from '../../Taxon'
import { View, Text, Form, Input, Button } from '@tarojs/components'

export default class Waitersignup extends Component<PropsWithChildren> {
  uid: int
  waiterId: int  //uid of whom was scanned

  instance = Taro.getCurrentInstance();
  state = {
    name: '' //name of whom was scanned
  }

  componentDidMount () {
    let params = this.instance.router.params
    this.waiterId = params.uid
    this.setState({
      name: params.name
    })
    Taro.getStorage({
      key: Env.storageKey
    })
    .then(res => {
      this.uid = res.data.id
    })
  }

  formSubmit = e => {
    if (this.waiterId === undefined) {
      Taro.showToast({
        title: '请重新扫码',
        icon: 'error',
        duration: 2000
      })
      return
    }
    let data = {}
    data.uid = this.uid
    data.waiterId = this.waiterId
    Taro.request({
      method: 'POST',
      data: data,
      url: Env.apiUrl + 'waiter/reg',
      success: function (res) { }
    }).then((res) =>{
      if (res.data.code === 0) {
        Taro.showToast({
          title: '已完成',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(
              () => {
                Taro.reLaunch({url: '/pages/me/index'})
              }, 500
            )
          }
        })
      }
    })
  }

  render () {
    return (
      <View className='waiterSignUp'>

      <Form className='form'
      onSubmit={this.formSubmit}
      >
      <View className='input'>
      <Text className='label'>登记服务员</Text>
      <Input 
        type='text' 
        value={this.state.name}
      />
      </View>
        <Button className='btn' formType='submit'>确认</Button>
      </Form>

      </View>
    )
  }
}
