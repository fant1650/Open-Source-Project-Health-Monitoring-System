# 关于本目录的说明
## health_visualization为前端应用项目根目录
### health_visualization下的node_modules为全部node.js库依赖,环境独立,使用者无需再次安装软件包
### public目录为可视化界面用到的静态资源,包括页面template,css和js包
### src为Vue服务器代码文件,作为启动页面的根组件

## project为后端应用项目根目录
### project根目录下的config.py文件用于处理网络跨域请求问题,根据需要将新的前端url添加至配置文件中
### AAA目录为后端业务的具体实现,包括启动程序app.py以及其余的数据分析包,服务器相关业务保存在app.py中,数据分析相关业务保存在余下的软件包内
### top_300_metrics为后端数据分析的全部数据,经过数据处理之后得到健康度时序数据,反馈在前端界面上
