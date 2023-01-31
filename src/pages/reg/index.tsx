import { Component, PropsWithChildren } from 'react'
import { View, Text, Form, Button, Picker } from '@tarojs/components'
import './index.scss'
import { AtList, AtListItem } from "taro-ui"
import { Env } from '../../env/env'
import Taro from '@tarojs/taro'
import { Input } from '@nutui/nutui-react-taro';

export default class Reg extends Component<PropsWithChildren> {
  state = {
    selector: ['门店', '代理商', '代理商(异业)', '区域代理商(异业)', '门店(异业)'],
    selectorChecked: '',
  }

  componentWillMount () { }

  componentDidMount () {
    Taro.getStorage({
      key: Env.storageKey,
      success: res => {
        this.setState({
          cid: res.data.cid
        })
      }
    })
  }

  pickerChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
      type: e.detail.value
    })
  }

  formSubmit (e) {
    let data = e.detail.value
    data.type = Number(this.state.type)
    if (isNaN(data.type)) {
      Taro.showToast({
        title: '请选择类型',
        icon: 'error',
        duration: 2000
      })
      return
    }
    let label = {
      name: '姓名',
      phone: '电话',
    }
    for (let i in data) {
      if (data[i] === "") {
        Taro.showToast({
          title: '请填写 ' + label[i],
          icon: 'error',
          duration: 2000
        })
        return
      }
    }

    data.submitter = '/api/consumers/' + this.state.cid
    Taro.request({
      method: 'POST',
      data: data,
      url: Env.apiUrl + 'regs',
      success: function (res) { }
    }).then((res) =>{
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
    })
  }

  render () {
    return (
      <View className='reg'>
      <Form className='form'
      onSubmit={this.formSubmit.bind(this)}
      >
      <Picker mode='selector' range={this.state.selector} onChange={this.pickerChange}>
      <AtList>
      <AtListItem
      title='请选择类型'
      extraText={this.state.selectorChecked}
      />
      </AtList>
      </Picker>
      <Input 
        name='orgName' 
        label='单位名称'
        type='text' 
        placeholder='' 
        required
      />
      <Input 
        name='name' 
        label='联系人'
        type='text' 
        placeholder='' 
        required
      />
      <Input 
        name='phone' 
        label='电话'
        type='number' 
        placeholder='' 
        required
      />
      <Input 
        name='address' 
        label='地址'
        type='text' 
        placeholder='' 
        required
        border={false}
      />
        <Button className='btn' formType='submit'>提交</Button>
      </Form>
      </View>
    )
  }
}
