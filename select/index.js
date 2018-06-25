import './src/style/client.css'

import Select from './src/mySelect/Select'
import arr1 from './src/data/test'
import arr2 from './src/data/test2' // 模拟异步请求结果

let select = new Select('mySelect', arr1, arr2);
