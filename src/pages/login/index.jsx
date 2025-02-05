import { useState, useEffect } from 'react'
import { Button, Form, Input } from 'antd'
const { TextArea } = Input;
import styles from './index.module.less'

function Login() {
  const [uid, setUid] = useState('')
  const [token, setToken] = useState('')
  const [towerData, setTowerData] = useState('')
  const [towerRender, setTowerRender] = useState(false)
  const [mingzuo, setMingzuo] = useState({})
  const serverId = '76402e5b20be2c39f095a152090afddc'

  const [charJson, setCharJson] = useState({})

  useEffect(() => {
    fetch('https://api.hakush.in/ww/data/character.json')
      .then(response => response.json())
      .then(data => setCharJson(data))
  }, [])

  const onFinish = () => {
    // console.log('saveDataToBrowser');
    localStorage.setItem('uid', uid)
    localStorage.setItem('token', token)
    alert('保存成功，可以查询')
  }

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo)
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
    formData.append('serverId', serverId)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        console.error('fetch error: ', response.status, response.statusText)
      }

      const rsp = await response.json()

      if (rsp.code === 200) {
        const res = JSON.parse(rsp.data)
        // console.log(res.difficultyList[3]);
        setTowerData(res)
        setTowerRender(true)
        const roleIds = new Set();
        for (const area of res.difficultyList[3].towerAreaList) {
          for (const floor of area.floorList) {
            for (const role of floor.roleList) {
              roleIds.add(role.roleId);
            }
          }
        }
        const uniqueRoleIds = Array.from(roleIds);
        // console.log(uniqueRoleIds);
        if (uniqueRoleIds.length > 0) {
          // 基础版
          const fetchAllSettled = async (ids) => {
            const requests = ids.map(id => {
              const formData = new URLSearchParams();
              formData.append('gameId', 3)
              formData.append('roleId', uid ? uid : localStorage.getItem('uid'))
              formData.append('serverId', serverId)
              formData.append('id', id.toString());
              return fetch('https://api.kurobbs.com/aki/roleBox/akiBox/getRoleDetail', {
                method: 'POST',
                body: formData,
                headers
              })
                .then(res => res.json())
                .catch(error => ({ id, error: error.message })); // 捕获单个错误
            });

            const results = await Promise.allSettled(requests);

            return results.map(result =>
              result.status === 'fulfilled' ? result.value : result.reason
            );
          };

          // 使用示例
          fetchAllSettled(uniqueRoleIds).then(results => {
            const successes = results.filter(r => !r.error);
            const failures = results.filter(r => r.error);
            const newArray = [];

            // 遍历原始数组
            for (const item of successes) {
              // 使用JSON.parse()解析每个元素的data属性
              const parsedData = JSON.parse(item.data);
              // 将解析后的对象添加到新数组中
              newArray.push(parsedData);
            }


            let result = {};

            // 遍历arrs
            newArray.forEach(item => {
              // 统计chainList中unlocked为true的数量
              let gongminglian = item.chainList.filter(chain => chain.unlocked).length;

              // 获取roleId和roleName
              let roleId = item.role.roleId;
              let roleName = item.role.roleName;

              // 将roleId作为对象名，roleName和gongminglian作为属性
              result[roleId] = { roleName, gongminglian };
            });

            // console.log(result);
            setMingzuo(result)
            // console.log('成功:', successes);
            // console.log('失败:', failures);
          });
        }
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
          <Input controls={false} style={{ width: '100%' }} size={'large'} value={uid} defaultValue={localStorage.uid > 0 ? localStorage.uid : uid} onChange={(e) => setUid(e.target.value)} />
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
      <a href="https://rh-docs.netlify.app/docs/list/client/kuro/">鸣潮token获取方法</a>
      <br />
      <p style={{ width: '90%' }}>
        手机上获取token：打开<a href="https://www.kurobbs.com/mc/">库街区鸣潮</a>，使用手机上的电脑模式（又叫UA，设置为PC）访问，随后在右上角操作登录，登录完成后，在浏览器地址栏复制以下代码启用手机模仿电脑F12控制台插件：
        {``}
        <br />
        <Input value={`javascript:(function () { var script = document.createElement('script');
         script.src="https://cdnjs.cloudflare.com/ajax/libs/eruda/2.4.1/eruda.min.js"; 
          document.body.appendChild(script); script.onload = function () { eruda.init() } })();`} / >
        随后屏幕右下角会出现一个方形齿轮图标，点击图标后可以打开和电脑一样的F12控制台，随后看网页

        左边鸣潮
        关注
        推荐
        今州茶馆
        攻略
        新手
        官方
        同人
        随便点一下这些菜单，随便点一下但是不要跳转到其他页面，否则就得重新激活插件。在打开插件的状态下切换左边菜单，网页会更新但不跳转，同时控制台会捕捉到网络请求，在network里面随便找到一个新的网络请求，里面就带有token，把token复制下来就行了。每次接收验证码登录token都会刷新
      </p>
      <br />
      <p style={{ width: '90%' }}>：获取到的角色命座【并非】深塔通关时的记录，而是通过库街区接口查询当前角色的命座。如果你用光漂通关后切换暗漂再查询，会出现当前角色和通关时命座不一致的情况。库洛本身并没有制作记录深塔通关角色信息的接口，都是二次查询拼接上的。</p>
      <br /><br />
      <Button onClick={fetchTest}>查询</Button>
      <br /><br /><br />
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
                            <div className={styles.roleRank}>
                              <p>{mingzuo[role.roleId]?.gongminglian}链</p>
                            </div>
                            <img className={styles.roleRankBg} src={charJson[role.roleId].rank === 5 ? "https://cloudflare-imgbed-4n1.pages.dev/file/char_bg5.png" : "https://cloudflare-imgbed-4n1.pages.dev/file/char_bg4.png"} />
                            <div className={styles.circleMask}>
                              <div className={styles.maskShow}>
                                <div className={styles.maskCut}>
                                  <img className={styles.roleIconUrl} src={role.iconUrl} />
                                </div>
                              </div>
                            </div>
                            <div className={styles.roleName}>
                              <span>{charJson[role.roleId]?.['zh-Hans'] || ''}</span>
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
