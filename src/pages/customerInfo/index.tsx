import { Component, PropsWithChildren } from 'react'
import { View, Text, Form, Button, Input, Checkbox, CheckboxGroup, Navigator, Image } from '@tarojs/components'
import { Input as input } from '@tarojs/components'
import './index.scss'
import { Env } from '../../env/env'
import Taro from '@tarojs/taro'
import { Taxon } from '../../Taxon'

export default class Customerinfo extends Component<PropsWithChildren> {
  user = {}
  uid: int
  state = {
    btnDisabled: true,
    isNew: true,
  }

  componentDidMount () { 
    Taro.getStorage({
      key: Env.storageKey,
      success: res => {
        this.uid = res.data.id
        this.user = res.data
        Taro.request({
          url: Env.apiUrl + 'users/' + this.uid,
        }).then((res) => {
          if (res.data.phone !== undefined && res.data.name !== undefined) {
            this.setState({
              btnDisabled: false,
              isNew: false
            })
          }
          this.setState({
            customer: res.data,
            avatarUrl: Env.imgUrl + 'avatar/' + res.data.avatar
          })
        })
      },
      fail: res => {
        console.log('pls login');
        Taro.redirectTo({ url: '/pages/chooseLogin/index' })
      }
    })
  }

  formSubmit = e => {
    let data = e.detail.value

    if (data.name == '') {
      Taro.showToast({
        title: '请填写姓名',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (data.phone == '') {
      Taro.showToast({
        title: '请填写电话',
        icon: 'error',
        duration: 2000
      })
      return
    }

    Taro.request({
      method: 'PATCH',
      data: data,
      url: Env.apiUrl + 'users/' + this.uid,
      header: {
        'content-type': 'application/merge-patch+json'
      }
    }).then((res) =>{
      if (res.statusCode === 200) {
        this.user.name = data.name
        this.user.phone = data.phone
        Taro.setStorage({
          key: Env.storageKey,
          data: this.user
        })

        if (this.state.avatarChanged) {
          let that = this
          Taro.uploadFile({
            url: Env.apiUrl + 'media_objects',
            filePath: this.state.avatarUrl,
            name: 'upload',
            formData: {
              'type': 6,
              'entityId': this.uid
            },
            success (res){
              that.setState({
                avatarUrl: res.data.url
              })
            }
          })
        }

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
      } else if (res.statusCode === 422) {
        Taro.showToast({
          title: '手机号已使用',
          icon: 'error',
          duration: 2000
        })
      } else if (res.statusCode === 404) {
        Taro.showToast({
          title: '未找到用户',
          icon: 'error',
          duration: 2000
        })
      } else {
        Taro.showToast({
          title: '系统错误',
          icon: 'error',
          duration: 2000
        })
      }
    })
  }

  checkboxChange(e){
    let s
    if (e.detail.value[0] == 'checked') {
      s = false
    } else {
      s = true
    }
    this.setState({
      btnDisabled: s
    })
  }

  onChooseAvatar = (e) =>{
    this.setState({
      avatarUrl: e.detail.avatarUrl,
      avatarChanged: true
    })
  }

  // how-to-set-state-of-multiple-properties-in-one-event-handler-react
  // https://codereview.stackexchange.com/a/211189
  handleChange = (k, e) => {
    // Updating an object with setState in React
    // https://stackoverflow.com/q/43638938/7714132
    this.setState(prevState => ({
      customer: {
        ...prevState.customer,
        [k]: e.detail.value
      }
    }))
  }

  render () {
    return (
      <View className='customerInfo main'>
      <View className='hint'>
        { this.state.isNew &&
        <Text>请完善姓名及电话</Text>
        }
      </View>

      { this.state.customer &&
      <Form className='form'
      onSubmit={this.formSubmit}
      >
      <Button class='avatar-wrapper' openType='chooseAvatar' onChooseAvatar={this.onChooseAvatar}>
        <Image class='avatar' src={this.state.avatarUrl}></Image>
      </Button>
        <View className='input'>
        <Text className='label'>姓名</Text>
        <Input 
          name='name' 
          type='nickname' 
          value={this.state.customer.name}
          onBlur={(e) => this.handleChange('name', e)}
        />
        </View>
        <View className='input'>
        <Text className='label'>电话</Text>
        <Input 
          name='phone' 
          type='text' 
          value={this.state.customer.phone}
          onBlur={(e) => this.handleChange('phone', e)}
        />
        </View>

        { this.state.isNew &&
        <View className='d-flex'>
        <CheckboxGroup onChange={this.checkboxChange.bind(this)}>
        <Checkbox value='checked'></Checkbox>
        </CheckboxGroup>
        我已阅读并同意<Navigator url='/pages/node/policy'>《用户协议》</Navigator>
        </View>
        }
        <Button className='btn' formType='submit' disabled={this.state.btnDisabled}>提交</Button>
      </Form>
      }
      </View>
    )
  }
}
