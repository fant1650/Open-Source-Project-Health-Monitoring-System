# Open-Source-Project-Health-Monitoring-System
这是一个用于github开源社区治理的项目健康度监测系统,用于帮助仓库管理者实时了解项目在开源社区的健康情况,并基于SARIMAX模型做时序<br><br>数据分析,预测未来八个月的项目健康度
<br><br>
## 健康度可视化展示(具体细节看演示视频)
<br>
考虑Vue对可视化库Echarts的兼容性和渐进式设计所带来的良好开发体验,我们采用Vue3+jQuery+Echarts制作本项目的数据可视化<br><br>
广泛使用异步函数点对点重新渲染图表,减少表单提交带来的网页全部重新渲染的低性能问题<br><br>
通过哈希映射查找对应项目数据的方式避免一次性加载较大数据量,优化浏览器渲染效率<br><br>
具体展示细节可以浏览本仓库根目录下的演示视频1和演示视频2<br><br>

![image](https://github.com/user-attachments/assets/2b1969fd-ff13-4f84-8e34-388fa081618d)

考虑Opendigger项目对于给定的字段已有较好的可视化playground,我们考虑将针对单一项目的健康度可视化图表嵌入聚合式可视化图表中,同时以简洁直观的折线图展示不同月份的各项核心指标,包括openrank以及participants的变化<br><br>
核心部分的健康度时序预测与健康度历史数据同时生成,帮助同时理解历史健康度和未来健康走向<br><br>

## 数据来源
数据来源于Opendigger开源工具提供的top_300_metrics,包含项目综合排名前三百的仓库相关数据
我们综合考虑活跃度算法和价值流网络,最终采用以下字段:
1.Activity
2.Stars
3.Attentions
4.Issue_resolution_duration
5.Issue_response_time
6.Issue_comments
7.Change_request_resolution_duration
8.Change_request_response_time
9.Participants
10.Openrank
11.Technical_fork
12.New_contributors
13.Inactive_contributors
其中4，5，7，8均取时序数据中当月的平均值.
<br><br>

## 健康度算法
特征对健康度health的影响以及对应权值的确定:由于项目是否健康在开源社区并未有相关标签,我们采用经验方法分析并做初始化.<br>
在给到的所有数据中，我们首先考虑单个项目的单种数据的变化，将最初的时间节点取0值，然后将当前时间下的数据与过往所有数据的均值做差，以得出该数据在某个时间下对于之前的数据的变化量.<br>对其进行归一化，在同一个数据中，项目各自的值去除以绝对值的最大值，计算后的值范围在-1~1之间，这样就能直观地表示这个项目的这个数据相对于其他项目的的同种数据的差距.最后在算出来的所有数据后进行加权，然后以给出的所有项目的结果进行截取然后得到健康的标准<br>
![image](https://github.com/user-attachments/assets/512a6812-abb4-49c6-81d4-8e2cc3ee28dc)<br>
上图节选自项目设计方案中的数学公式
<br><br>

## 健康度意义参照
健康度(health)最终范围在[-1,1]之间<br>
健康度的正负表示该项目是否健康,其中正数越靠近1表示项目近期各项指标良性发展,反映项目越健康<br>
反之越靠近-1同理
<br><br>

## 关于健康度时间序列数据的预测
本项目采用SARIMAX对得到的健康度数据进行时序预测,以帮助管理者更好地理解项目健康的未来趋势<br>
SarimaX，全称为Seasonal AutoRegressive integrated moving average with eXogenous regressors，也称为“扩展SARIMA模型”，是一种基于时间序列的预测模型。它是在经典的ARIMA模型的基础上，增加了对外部因素的考虑，可以更好地应用于实际预测中。<br>
SARIMAX模型的主要特点是考虑了时间序列数据的季节性变化以及外部因素的影响，同时还考虑了序列的自回归、滑动平均和差分等因素。SARIMAX模型可以用来预测各种类型的时间序列数据，包括销售、股票价格、气象数据等等。<br>
该模型的核心思想是将时间序列数据分解为趋势、季节性和随机性三个部分，并通过对这三个部分的建模来预测未来的数据走势。同时，SARIMAX模型还可以通过引入外部因素，如收入、广告、天气等，来提高模型的准确性和预测能力。<br>
ARMAX模型最简单的方案就是把外部变量xt当成一个依赖变量,加入到ARMA的回归方程中,如下:
![image](https://github.com/user-attachments/assets/72d8887f-7171-40cf-8b21-01db96dec665)<br>
xt就是外部变量,β为其回归系数.这种方式看上去很直接,但是其最大的缺点是回归系数β难以解释.β的值不能解释为xt增加1,yt所增加的值.<br>
如果使用滞后算子来改写:<br>
![image](https://github.com/user-attachments/assets/c7d141ae-a31c-4abd-8257-0f965d86b92c)<br>
注意到自回归系数(AR)混入了外部变量系数和误差项系数。考虑回归ARMA模型的误差，<br>
![image](https://github.com/user-attachments/assets/9f7bed22-3f4e-4f27-8558-c4e0146b0c70)<br>
这种形势下，回归系数就可以以其通用解释方法来解释。以滞后算子表示如下，<br>
![image](https://github.com/user-attachments/assets/84e68243-8d35-44b9-adee-a1ac28465168)<br>
Box和Jenkis带来一个使用转换函数的泛化模型，<br>
![image](https://github.com/user-attachments/assets/5d61277c-921a-405b-b415-bbbd10d2c6c6)<br>
这种形式允许外部变量或称为协变量的作用到（通过β ( L ),或者使协变量的衰减效果很大(通过V ( L ))
模型方程如下：<br>
![image](https://github.com/user-attachments/assets/d0750e3e-b00c-48e9-8ffc-4bc0aecad4cb)<br>
![image](https://github.com/user-attachments/assets/1f261ab1-2534-405c-b6ff-55688bb5f626)
<br><br>
具体api调用细节可以参考./health_monitor/project/AAA/app.py文件下的get_predict()函数<br><br>

## 实现技术栈
### 前端: Node.js+jQuery+Vue3.js+Echarts+webpack
### 数据分析: python+Flask+statsmodels
<br>

## 如何部署本项目
本项目采用前后端分离的总体架构

### 前端服务器部署
对于前端服务器(即health_monitor目录下的health_visualization项目),您需要确保您的工作环境已经安装有node.js以及Vue3.js<br><br>
1.安装node.js<br>
访问Node.js的官方网站：https://nodejs.org/  ,根据您的操作系统（Windows、macOS、Linux）选择对应的安装包。建议选择LTS（长期支持）版本，以确保稳定性和安全性。<br>
对于Windows用户，可以选择.msi安装包；对于macOS用户，可以选择.pkg安装包；对于Linux用户，可以根据发行版选择对应的包管理器安装或下载二进制文件。<br>
之后参考node.js官方文档操作即可<br>
2.安装Vue CLI<br>
在终端中输入如下指令
```
npm install -g @vue/cli
```
安装完成后,输入如下指令来检查Vue CLI是否安装成功
```
vue --version
```
3.启动服务器<br>
所有依赖安装完成后,进入项目目录<br>
```
cd ./health_visualization
```
在命令行输入如下指令以启动服务器
```
npm run serve
```

### 后端服务器部署
对于后端服务器(即health_monitor目录下的project项目),本项目使用的python解释器已上传在项目根目录下<br>
1.启动flask服务器
```
cd ./project/AAA
```
```
python app.py
```
或者使用IDE直接运行AAA文件夹下的app.py亦可<br><br>

## 成员分工
### 刘耀辉(队长)
#### 1. 整体架构设计
<br>
Q: 在React和Vue3之间,为什么选择Vue框架作为项目可视化搭建平台?<br>
A: React在大数据分析中确实有良好的性能,但是考虑到Vue3近年针对数据可视化越来越完善的生态圈以及渐进式开发带来的代码良好的可阅读性, &nbsp &nbsp 我们最终选择Vue3作为前端开发和打包的方式<br><br>
&nbsp &nbsp 同时考虑小组成员前后端开发经验仍然不足,使用Vue框架可以极大减少我们的学习曲线,统一成员技术栈<br><br>
Q: 本项目后端为何选择flask框架,而不用更为主流的Spring系列?<br><br>
A: 本次比赛给予的开发时间极其有限,特别是我们两个队员还处于期末考试的压力之下,很难考虑到产品上线之后的生产端问题,Flask框架也只是一 &nbsp &nbsp 个开发场景服务器,并不能作为生产场景的良好选择,所以我们建议如果要部署本项目,可以用Django重新构建后端业务<br><br>
Q: 这个项目现在可以看到github所有项目的健康度分析吗?<br><br>
A: 目前本项目所用数据为Opendigger所提供的top300项目的各项指标,所以不能展示所有的开源项目的健康度,但是如果有对我们项目很有兴趣的同行,可以向后台数据添加自己仓库的各项时间序列数据,这样就可以用本项目分析您仓库的健康度<br><br><br>

#### 2.前端可视化平台开发与服务器搭建
<br>
刘耀辉(参赛队长)参与了所有web app的开发部分以及最后可视化图表的数据处理,并通过AJAX的异步库实现从后端服务器获取数据的相关业务<br><br>

#### 3.后端时序数据预测的api调用相关数据处理
<br>
刘耀辉(参赛队长)参与了后端和健康度预测有关的SARIMAX对象的api调用,并通过处理前端请求对数据做了与模型协调的预处理工作<br><br>

#### 4.健康度算法的设计与归一化思路
<br>

### 曹欣元(队员)
#### 1.健康度算法的实现
<br>
曹欣元(队员)完成了健康度算法的具体实现细节,并提出了该项目的算法数学基础<br><br>

#### 2.后端数据处理与分析
<br>
曹欣元(队员)将与健康度有关的13项指标的原始数据进行数据处理,并jsonify对应数据为后端接受POST请求产生response做铺垫<br><br>

#### 3.后端服务器搭建与HTTP请求response结果的处理
<br>
曹欣元(队员)用flask框架搭建起了本项目的后端服务器并进行前端请求的有效处理,通过多个url的设置避免了同时在页面中加载全部数据<br><br>

