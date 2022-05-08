# QQ-search
Simple QQ query

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\

### `npm test`

Launches the test runner in the interactive watch mode.\


### `npm run build`

Builds the app for production to the `build` folder.\

## 实现的功能

实现的功能如下：

### 项目基本功能

完成了查询QQ的基本功能，对不同状态的有相应的响应,并且使用防抖函数对api进行处理.\

### 单元测试

完成了该项目的单元测试，测试内容包括:\

1. 当api状态码异常时，ui是否显示错误信息.\
2. 多次输入QQ号时，防抖函数是否生效.\
3. 当api返回成功时，ui是否显示qq和qq名

### 额外使用的包 
axios sass
