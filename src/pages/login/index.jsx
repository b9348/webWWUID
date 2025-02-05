import { useState, useEffect } from 'react'
import { Button, Form, Input, InputNumber } from 'antd'
const { TextArea } = Input;
import styles from './index.module.less'

function Login() {
  const [uid, setUid] = useState('')
  const [token, setToken] = useState('')
  const [towerData, setTowerData] = useState('')
  const [towerRender, setTowerRender] = useState(false)

  const [charJson, setCharJson] = useState({})

  useEffect(() => {
    fetch('https://api.hakush.in/ww/data/character.json')
      .then(response => response.json())
      .then(data => setCharJson(data))
  }, [])

  const onFinish = () => {
    console.log('saveDataToBrowser');
    localStorage.setItem('uid', uid)
    localStorage.setItem('token', token)
    alert('保存成功，可以查询')
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const fetchTest = async () => {
    const url = 'https://api.kurobbs.com/aki/roleBox/akiBox/towerDataDetail'
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
      "Accept": "application/json, text/plain, */*",
      "pragma": "no-cache",
      "cache-control": "no-cache",
      "sec-ch-ua": "\"Chromium\";v=\"124\", \"Android WebView\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
      "source": "h5",
      "devcode": "111.181.85.154, Mozilla/5.0 (Linux; Android 14; 22081212C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 Kuro/2.2.0 KuroGameBox/2.2.0",
      "sec-ch-ua-platform": "\"Android\"",
      "origin": "https://web-static.kurobbs.com",
      "x-requested-with": "com.kurogame.kjq",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "priority": "u=1, i",
      "token": token ? token : localStorage.getItem('token'),
    }

    const formData = new URLSearchParams()
    formData.append('gameId', 3)
    formData.append('roleId', uid ? uid : localStorage.getItem('uid'))
    formData.append('serverId', '76402e5b20be2c39f095a152090afddc')
    formData.append('id', '1505')
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData,
      })

      if (!response.ok) {
        console.error('fetch error: ', response.status, response.statusText)
      }

      const rsp = await response.json()

      if (rsp.code === 200) {
        const res = JSON.parse(rsp.data)
        console.log(res.difficultyList[3]);
        setTowerData(res)
        setTowerRender(true)
      } else {
        alert(rsp.msg)
        console.error('api error:', JSON.stringify(rsp))
      }
    } catch (error) {
      console.error('fetch error:', error)
    }
  }

  const tower = towerData.difficultyList && towerData.difficultyList[3]
  return (
    <div className={styles.wrapper}>
      <Form
        name="basic"
        // labelCol={{ span: 2 }}
        // wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="UID"
          name="uid"
          type="number"
          rules={[{ required: true, message: 'Please input your UID!' }]}
        >
          <InputNumber controls={false} style={{ width: '100%' }} size={'large'} value={uid} defaultValue={localStorage.uid ? localStorage.uid : uid} onChange={(e) => setUid(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Token"
          name="token"
          rules={[{ required: true, message: 'Please input your token!' }]}
        >
          <TextArea rows={6} value={token} defaultValue={localStorage.token ? localStorage.token : token} onChange={(e) => setToken(e.target.value)} />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>

      <p>保存后token会保存在浏览器本地，token过期之前不用再填</p>
      {/* 深境区tower     深境之塔area */}
      <button onClick={fetchTest}>查询</button>
      <div className={styles.BGI} style={{
        backgroundImage: `url(https://cloudflare-imgbed-4n1.pages.dev/file/bg4.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

        {towerRender && <div className={styles.tower} >
          {tower.towerAreaList.map(area => {
            return <div key={area.areaId} className={styles.areaWrapper}>
              <div className={styles.areaInfo}>
                <div className={styles.areaName}>{tower.difficultyName}-{area.areaName}{area.star}/{area.maxStar}</div>
                <div className={styles.areaFloors}>
                  {area.floorList.map(floor => {
                    return <div key={floor.floor} className={styles.floorBox}
                      style={{
                        backgroundImage: `url(${floor.picUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}>
                      <div className={styles.floorBoxLeft}>
                        <div className={styles.floorName}>第 {floor.floor} 层</div>
                        <div className={styles.floorStar}>
                          {Array.from({ length: floor.star }).map((_, i) => <img key={i} className={styles.floorStarFull} src="https://cloudflare-imgbed-4n1.pages.dev/file/star_full.png" />)}
                          {Array.from({ length: floor.maxStar - floor.star }).map((_, i) => <img key={i} className={styles.floorStarEmpty} src="https://cloudflare-imgbed-4n1.pages.dev/file/star_empty.png" />)}

                        </div>
                      </div>
                      <div className={styles.floorBoxRight}>
                        {floor.roleList.map(role => {
                          return <div key={role.roleId} className={styles.roleBox}>
                            <img className={styles.roleRankBg} src={charJson[role.roleId].rank === 5 ? "https://cloudflare-imgbed-4n1.pages.dev/file/char_bg5.png" : "https://cloudflare-imgbed-4n1.pages.dev/file/char_bg4.png"} />
                            <div className={styles.circleMask}>
                              <div className={styles.maskShow}>
                                <div className={styles.maskCut}>
                                  <img className={styles.roleIconUrl} src={role.iconUrl} />
                                </div>
                              </div>
                            </div>
                            <div className={styles.roleName}>
                              <span>{charJson[role.roleId]?.['zh-Hans'] || ''} </span>
                            </div>
                          </div>
                        })}
                      </div>
                    </div>
                  })}
                </div>
              </div>
            </div>
          })}

        </div>}
      </div>
    </div>
  )
}

export default Login
