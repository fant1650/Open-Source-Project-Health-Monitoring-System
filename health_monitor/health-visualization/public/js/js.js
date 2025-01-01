let projectHealth = {}
let predictHealth = {}
let cur_health = 0
let stars_sorted = []
let pj = []
let p_star = []
let stars = 0
let openrank = {}
let participants = {}
let flag = false
let f1=false, f2=false, f3=false, f4=false, f5=false
let xaxis = ['2015-01','2015-02','2015-03','2015-04','2015-05','2015-06','2015-07','2015-08','2015-09','2015-10','2016-01','2016-02','2016-03','2016-04','2016-05','2016-06','2016-07','2016-08','2016-09','2016-10','2016-11','2016-12','2017-01','2017-02','2017-03','2017-04','2017-05','2017-06','2017-07','2017-08','2017-09','2017-10','2017-11','2017-12','2018-01','2018-02','2018-03','2018-04','2018-05','2018-06']
let yaxis = [0,0.496,0.255,0.073,-0.070,-0.010,0.003,-0.049,0.017,0.162,0.056,-0.023,0.006,0.003,0.073,0.127,0.076,0.065,0.099,0.088,0.058,0.183,0.140,-0.007,0.261,0.068,0.070,0.046,0.103,0.098,0.162,0.092,0.322,0.128,0.120,0.015,0.132,-0.020,0.041,0.047,0.049,0.110]
let yaxis_p = [231,333,354,317,266,311,310,291,362,420,332,283,291,284,327,389,357,326,342,383,323,384,367,288,423,259,353,321,342,296,395,289,432,490,358,367,474,263,303,303,304,255]
let yaxis_o = [57.23,104.99,132.26,157,160.75,180.79,183.9,169.37,182.3,217.94,209.01,203.77,193.64,186.62,218.33,224.24,263.11,300.59,245.81,263,243.26,322.22,206.63,256.43,330.77,243.72,246.08,267.53,240.65,247.11,298.5,307.13,267.06,370.98,341.87,295.3,279.56,217.65,221.91,243.95,265.56,236.91]

$(window).load(function(){  
  $(".loading").fadeOut()
})
/****/
$(document).ready(function(){
	var whei=$(window).width()
	$("html").css({fontSize:whei/20})
	$(window).resize(function(){
		var whei=$(window).width()
	  $("html").css({fontSize:whei/20})
  });
});

async function fetchData(event) {
  const formData = {
    inputText: $('#projectName').val()
  };
  
  document.getElementById('project').innerHTML = $('#projectName').val()

  await axios.post('http://127.0.0.1:5000/', formData).then((response)=>{
    flag = true
    console.log('health :', response.data.results);
    projectHealth = response.data.results
    cur_health = parseFloat(response.data.results['2023-03'].toFixed(3))
    document.getElementById('health').innerHTML = cur_health
    f1=true
  }).catch((error) => {
    console.log(error);
    console.log("健康度没有被正确赋值")
  });

  await axios.post('http://127.0.0.1:5000/predict', formData).then((response)=>{
    predictHealth = response.data.predict
    console.log("predict :", response.data.predict)
  }).catch((error) => {
    console.log(error);
    console.log("健康度预测没有被正确赋值")
  });

  await axios.get('http://127.0.0.1:5000/stars/sorted').then((response)=>{
    console.log('stars_sorted :', response.data.stars_sorted);
    for(let i=0;i<9;i++){
      stars_sorted.push(response.data.stars_sorted[i]);
      pj.push(stars_sorted[i][0])
      p_star.push(stars_sorted[i][1])
    }
    f2=true
    console.log(p_star)
  }).catch((error) => {
    console.log(error);
    console.log("star_sorted没有被正确赋值")
  });

  await axios.post('http://127.0.0.1:5000/stars', formData).then((response)=>{
    console.log('stars :', response.data.stars);
    stars = response.data.stars
    document.getElementById('star').innerHTML = stars
    f3=true
  }).catch((error) => {
    console.log(error);
    console.log("stars没有被正确赋值")
  });
 
  await axios.post('http://127.0.0.1:5000/openrank', formData).then((response)=>{
    console.log('openrank :', response.data.openrank);
    openrank = response.data.openrank
    f4=true
  }).catch((error) => {
    console.log(error);
    console.log("openrank没有被正确赋值")
  });

  await axios.post('http://127.0.0.1:5000/participants', formData).then((response)=>{
    console.log('participants :', response.data.participants);
    participants = response.data.participants
    f5=true
  }).catch((error) => {
    console.log(error);
    console.log("participants没有被正确赋值")
  });

}

$(document).ready(() => {
  $('#myForm').on('submit', async (event) => {
    event.preventDefault();
    await fetchData();
    if(f1&&f2&&f3&&f4&&f5){
      echarts_1()
      echarts_2()
      echarts_3()
      echarts_4()
      echarts_5()
    }else{
      console.log('数据没有正确赋值')
    }
  })
})


function echarts_1() {
  var myChart = echarts.init(document.getElementById('echarts1'));
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
    },
    "grid": {
      "top": "20%",
      "right":"50",
      "bottom":"20",
      "left":"30",
    },
    "xAxis": [
      {
        "type": "category",
        data: Object.keys(projectHealth) ,
        axisLine: { lineStyle: {color: "rgba(255,255,255,.1)"}},
        axisLabel: { 
          textStyle: {color: "rgba(255,255,255,.7)", fontSize: '14', },
          interval: flag === true ? Object.keys(projectHealth).length/5 : xaxis.length/5
        },
      },
    ],
    "yAxis": [
      {
        "type": "value",
        "name": "health",
        axisTick: {show: false},
        splitLine: {
          show: false,
        },
        "axisLabel": {
          "show": true,
          fontSize:14,
          color: "rgba(255,255,255,.6)"  
        },
        axisLine: {
          min:0,
          max:10,
          lineStyle: {color: 'rgba(255,255,255,.1)'}
        },//左线色  
        splitLine: {show:true,lineStyle: {color:'rgba(255,255,255,.1)'}},//x轴线
      },
    ],
    "series": [
      {
        "name": "health",
        "type": "line",
        smooth: true,
        "yAxisIndex": 0,
        // "data": flag === true ? projectHealth.values() : yaxis,
        "data": Object.values(projectHealth),
        lineStyle: {
          normal: {
            width: 2
          },
        },
        "itemStyle": {
          "normal": {
          "color": "#86d370",   
          }
        },
      },
    ]
  };

  myChart.setOption(option);
  window.addEventListener("resize",function(){
      myChart.resize();
  });
}

function echarts_2() {
  var myChart2 = echarts.init(document.getElementById('echarts2'));
// 基于准备好的dom，初始化echarts实例
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
      // formatter:'{c}' ,
    },
    grid: {
      left: '0',
      top: '30',
      right: '10',
      bottom: '-20',
      containLabel: true
    },
    xAxis: [{
      "type": "category",
        data: Object.keys(predictHealth) ,
        axisLine: { lineStyle: {color: "rgba(255,255,255,.1)"}},
        axisLabel: { 
          textStyle: {color: "rgba(255,255,255,.7)", fontSize: '14', },
          interval: 1
        },
      data: Object.keys(predictHealth)
    }, 
    {
      axisPointer: {show: false},
      axisLine: {show: false},
      position: 'bottom',
      offset: 20,
    }],
    yAxis: [{
      type: 'value',
      axisTick: {show: false},
      // splitNumber: 6,
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,.1)'
        }
      },
      axisLabel:  {
        formatter: "{value}",
        textStyle: {
          color: "rgba(255,255,255,.6)",
          fontSize:14,
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,.1)'
        }
      }
    }],
    series: [{
      name: 'health',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        normal: {
          color: 'rgba(228, 228, 126, 1)',
          width: 2
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(228, 228, 126, .2)'
          }, 
          {
            offset: 1,
            color: 'rgba(228, 228, 126, 0)'
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(228, 228, 126, 1)',
          borderColor: 'rgba(228, 228, 126, .1)',
          borderWidth: 12
        }
      },
      data: Object.values(predictHealth)
    }, 
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart2.setOption(option);
  window.addEventListener("resize",function(){
    myChart2.resize();
  });
}

function echarts_3() {
  var myChart3 = echarts.init(document.getElementById('echarts3'));
// 基于准备好的dom，初始化echarts实例
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['participants'],
      right: 'center',
      top:0,
      textStyle: {
        color: "#fff"
      },
      itemWidth: 12,
      itemHeight: 10,
      // itemGap: 35
    },
    grid: {
      left: '0',
      right: '20',
      bottom: '0',
      top:'15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: flag === true ? Object.keys(participants) : xaxis,
      axisLine: {
        lineStyle: {
          color: 'white'
        },
      },
      axisLabel: {
      //rotate:-90,
        // formatter:function(value){return value.split("").join("\n");},
        textStyle: {
          color: "rgba(255,255,255,.6)",
          fontSize:14,
        },
        interval: flag === true ? Object.keys(participants).length/4 : xaxis.length/4
      },
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      axisTick: {show: false},
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      },
      axisLabel: {textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize:14,
      }},
      axisLine: {show:false},
    },
    
    series: [{
      name: '字段1',
      type: 'line',
      stack: 'a',
      barWidth: '30',
      itemStyle: {
        normal: {
          color: '#8bd46e', }
      },
      data: Object.values(participants)
    },
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart3.setOption(option);
  window.addEventListener("resize",function(){
    myChart3.resize();
  });
}

function echarts_4() {
  var myChart4 = echarts.init(document.getElementById('echarts4'));
  // 基于准备好的dom，初始化echarts实例
  var myColor=['#eb2100','#eb3600','#d0570e','#d0a00e','#34da62','#00e9db','#00c0e9','#0096f3'];
  option = {
    grid: {
      left: '2%',
      top:'1%',
      right: '5%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: [{
      show: false,
    }],
    yAxis: [{
      axisTick:'none',
      axisLine:'none',
      offset:'7',
      axisLabel: {
        textStyle: {
          color: 'rgba(255,255,255,.6)',
          fontSize:'14',
        }
      },
      data: ['react', 'tensorflow', 'flutter', 'vscode', 'react-native', 'go', 'electron', 'next.js', 'ant-design'].reverse()
    },
    ],
    series: [{
      name: '条',
      type: 'bar',
      yAxisIndex: 0,
      data: [233680, 202799, 175781, 166119, 127055, 123271, 119585, 115322, 108380].reverse(),
      label:{
        normal:{
          show:true,
          position:'right',
          formatter:function(param){
            return param.value;
          },
          textStyle:{
            color: 'rgba(255,255,255,.8)',
            fontSize:'12',
          }
        }
      },
      barWidth: 15,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: '#03c893'
          },
          {
            offset: 1,
            color: '#0091ff'
          }]),
          barBorderRadius: 15,
        }
      },
      z: 2
    }, 
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart4.setOption(option);
  window.addEventListener("resize",function(){
      myChart4.resize();
  });
}

function echarts_5() {
  var myChart5 = echarts.init(document.getElementById('echarts5'));
// 基于准备好的dom，初始化echarts实例
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
    },
    "grid": {
      "top": "15%",
      "right":"10%",
      "bottom":"20",
      "left":"10%",
    },
    legend: {
      data: ['openrank'],
      right: 'center',
      top:0,
      textStyle: {
        color: "#fff"
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    "xAxis": [
      {
        "type": "category",
        data: flag === true ? Object.keys(openrank) : xaxis,
        axisLine: { lineStyle: {color: "rgba(255,255,255,.1)"}},
        axisLabel:  { 
          textStyle: {color: "rgba(255,255,255,.7)", fontSize: '14', },
          interval: flag === true ? Object.keys(openrank).length/5 : xaxis.length/5
        },
      },
    ],
    "yAxis": [
      {
        "type": "value",
        "show": true,
        axisTick: {show: false},
        "axisLabel": {
          "show": true,
          formatter: "{value} ",
          color: "rgba(255,255,255,.6)"
        },
        axisLine: {lineStyle: {color: 'rgba(255,255,255,.1)'}},//右线色
        splitLine: {show:true,lineStyle: {color:'rgba(255,255,255,.1)'}},//x轴线
      },
    ],
    "series": [
    {
      "name": "openrank",
      "type": "line",
      "yAxisIndex": 0,
      "data": flag === true ? Object.values(openrank) : yaxis_o,
      lineStyle: {
        normal: {
          width: 2
        },
      },
      "itemStyle": {
        "normal": {
          "color": "#ff3300",
        }
      },
      "smooth": true
    }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart5.setOption(option);
  window.addEventListener("resize",function(){
    myChart5.resize();
  });
}



$(window).load(function(){$(".loading").fadeOut()})  

function updateChart1() {
  // 新的数据
  var newOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
    },
    "grid": {
      "top": "20%",
      "right":"50",
      "bottom":"20",
      "left":"30",
    },
    "xAxis": [
      {
        "type": "category",
        data: flag === true ? projectHealth.keys() : xaxis,
        axisLine: { lineStyle: {color: "rgba(255,255,255,.1)"}},
        axisLabel: { 
          textStyle: {color: "rgba(255,255,255,.7)", fontSize: '14', },
          interval: flag === true ? projectHealth.keys().length/5 : xaxis.length/5
        },
      },
    ],
    "yAxis": [
      {
        "type": "value",
        "name": "health",
        axisTick: {show: false},
        splitLine: {
          show: false,
        },
        "axisLabel": {
          "show": true,
          fontSize:14,
          color: "rgba(255,255,255,.6)"  
        },
        axisLine: {
          min:0,
          max:10,
          lineStyle: {color: 'rgba(255,255,255,.1)'}
        },//左线色  
        splitLine: {show:true,lineStyle: {color:'rgba(255,255,255,.1)'}},//x轴线
      },
    ],
    "series": [
      {
        "name": "health",
        "type": "line",
        smooth: true,
        "yAxisIndex": 0,
        "data": flag === true ? projectHealth.values() : yaxis,
        lineStyle: {
          normal: {
            width: 2
          },
        },
        "itemStyle": {
          "normal": {
          "color": "#86d370",   
          }
        },
      },
    ]
  };

  // 更新图表
  myChart.setOption(newOption);
}

function updateChart2() {
  // 新的数据
  var newOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
      // formatter:'{c}' ,
    },
    grid: {
      left: '0',
      top: '30',
      right: '10',
      bottom: '-20',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      axisLabel:{
        rotate: -90,
        textStyle: {
          color: "rgba(255,255,255,.6)",
          fontSize:14,
        },
        interval: 2
      },
      axisLine: {
        lineStyle: { 
          color: 'rgba(255,255,255,.1)'
        }
      },
      data: ['17年3月', '17年6月', '17年9月', '17年12月', '18年3月', '18年6月', '18年9月', '18年12月', '19年3月', '19年6月', '19年9月', '19年12月']
    }, 
    {
      axisPointer: {show: false},
      axisLine: {  show: false},
      position: 'bottom',
      offset: 20,
    }],
    yAxis: [{
      type: 'value',
      axisTick: {show: false},
      // splitNumber: 6,
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,.1)'
        }
      },
      axisLabel:  {
        formatter: "{value} %",
        textStyle: {
          color: "rgba(255,255,255,.6)",
          fontSize:14,
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,.1)'
        }
      }
    }],
    series: [{
      name: 'health',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        normal: {
          color: 'rgba(228, 228, 126, 1)',
          width: 2
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(228, 228, 126, .2)'
          }, 
          {
            offset: 1,
            color: 'rgba(228, 228, 126, 0)'
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(228, 228, 126, 1)',
          borderColor: 'rgba(228, 228, 126, .1)',
          borderWidth: 12
        }
      },
      data: [12.50, 14.4, 16.1, 14.9, 20.1, 17.2, 17.0, 13.42, 20.12, 18.94, 17.27, 16.10]
    }, 
    ]
  };

  // 更新图表
  myChart2.setOption(newOption);
}

function updateChart3() {
  // 新的数据
  var newOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['participants'],
      right: 'center',
      top:0,
      textStyle: {
        color: "#fff"
      },
      itemWidth: 12,
      itemHeight: 10,
      // itemGap: 35
    },
    grid: {
      left: '0',
      right: '20',
      bottom: '0',
      top:'15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: flag === true ? participants.keys() : xaxis,
      axisLine: {
        lineStyle: {
          color: 'white'
        },
      },
      axisLabel: {
      //rotate:-90,
        // formatter:function(value){return value.split("").join("\n");},
        textStyle: {
          color: "rgba(255,255,255,.6)",
          fontSize:14,
        },
        interval: flag === true ? participants.keys().length/4 : xaxis.length/4
      },
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      axisTick: {show: false},
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      },
      axisLabel: {textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize:14,
      }},
      axisLine: {show:false},
    },
    
    series: [{
      name: '字段1',
      type: 'line',
      stack: 'a',
      barWidth: '30',
      itemStyle: {
        normal: {
          color: '#8bd46e', }
      },
      data: yaxis_p
    },
    ]
  };

  // 更新图表
  myChart3.setOption(newOption);
}

function updateChart4() {
  // 新的数据
  var newOption = {
    grid: {
      left: '2%',
      top:'1%',
      right: '5%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: [{
      show: false,
    }],
    yAxis: [{
      axisTick:'none',
      axisLine:'none',
      offset:'7',
      axisLabel: {
        textStyle: {
          color: 'rgba(255,255,255,.6)',
          fontSize:'14',
        }
      },
      data: ['react', 'tensorflow', 'flutter', 'vscode', 'react-native', 'go', 'electron', 'next.js', 'ant-design'].reverse()
    },
    ],
    series: [{
      name: '条',
      type: 'bar',
      yAxisIndex: 0,
      data: [233680, 202799, 175781, 166119, 127055, 123271, 119585, 115322, 108380].reverse(),
      label:{
        normal:{
          show:true,
          position:'right',
          formatter:function(param){
            return param.value;
          },
          textStyle:{
            color: 'rgba(255,255,255,.8)',
            fontSize:'12',
          }
        }
      },
      barWidth: 15,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: '#03c893'
          },
          {
            offset: 1,
            color: '#0091ff'
          }]),
          barBorderRadius: 15,
        }
      },
      z: 2
    }, 
    ]
  };

  // 更新图表
  myChart4.setOption(newOption);
}

function updateChart5() {
  // 新的数据
  var newOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
    },
    "grid": {
      "top": "15%",
      "right":"10%",
      "bottom":"20",
      "left":"10%",
    },
    legend: {
      data: ['openrank'],
      right: 'center',
      top:0,
      textStyle: {
        color: "#fff"
      },
      itemWidth: 12,
      itemHeight: 10,
    },
    "xAxis": [
      {
        "type": "category",
        data: flag === true ? openrank.keys() : xaxis,
        axisLine: { lineStyle: {color: "rgba(255,255,255,.1)"}},
        axisLabel:  { 
          textStyle: {color: "rgba(255,255,255,.7)", fontSize: '14', },
          interval: flag === true ? openrank.keys().length/5 : xaxis.length/5
        },
      },
    ],
    "yAxis": [
      {
        "type": "value",
        "show": true,
        axisTick: {show: false},
        "axisLabel": {
          "show": true,
          formatter: "{value} ",
          color: "rgba(255,255,255,.6)"
        },
        axisLine: {lineStyle: {color: 'rgba(255,255,255,.1)'}},//右线色
        splitLine: {show:true,lineStyle: {color:'rgba(255,255,255,.1)'}},//x轴线
      },
    ],
    "series": [
    {
      "name": "openrank",
      "type": "line",
      "yAxisIndex": 0,
      "data": flag === true ? openrank.values() : yaxis_o,
      lineStyle: {
        normal: {
          width: 2
        },
      },
      "itemStyle": {
        "normal": {
          "color": "#ff3300",
        }
      },
      "smooth": true
    }
    ]
  };

  // 更新图表
  myChart5.setOption(newOption);
}

