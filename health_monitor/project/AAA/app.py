from flask import Flask,request, jsonify
from flask_cors import CORS
import config
import Activity
import Attention
import Change_request_resolution_duration
import Change_request_response_time
import Technical_fork
import Issue_response_time
import Issue_comments
import Issue_resolution_duration
import Openrank
import Stars
import Participants
import Inactive_contributors
import New_contributors
import Merge
import starspro
import openrankpro
import participantspro
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import adfuller
import pandas as pd
import numpy as np
from datetime import datetime

# 创建一个 Flask 应用实例
app = Flask(__name__)
CORS(app, origins=config.SRC_URL)

result={}
stars_sorted={}
raw_openrank={}
raw_participants={}

# 根目录返回健康度数据
@app.route('/',methods=['POST'])
def home():
    input_text = request.json.get('inputText')
    print("开始传输!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print(f"health接受字符串为 {input_text}")
    data = {
        "results": result[input_text],
    }
    return jsonify(data)

@app.route('/predict', methods=['POST'])
def get_predict():
    input_text = request.json.get('inputText')
    print(f"predict接受字符串为 {input_text}")

    time_series = []
    health = []
    print(result[input_text])
    for key, value in result[input_text].items():
        if 'raw' not in key:
            time_series.append(key)
            health.append(value)
    z = zip(time_series, health)
    z = sorted(z, key=lambda x: datetime.strptime(x[0], "%Y-%m"))
    time_series, health = zip(*z)
    series = pd.Series(health, index=pd.to_datetime(time_series, format="%Y-%m"))

    # 假设我们选择了SARIMAX(1, 1, 1)模型
    model = SARIMAX(series, order=(1, 1, 1))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=10)
    # 保持forecast的索引为datetime类型
    predict = dict(zip(forecast.index.strftime("%Y-%m"), forecast))
    print(time_series)
    print(forecast.index)
    data = {
        "predict": predict
    }
    return jsonify(data)

# 返回排好序的收藏量数据
@app.route('/stars/sorted', methods=['GET'])
def get_stars_sorted():
    data = {

        "stars_sorted": list(stars_sorted.items())
    }
    return jsonify(data)

# 返回收藏数数据
@app.route('/stars', methods=['POST'])
def get_stars():
    input_text = request.json.get('inputText')
    print(f"stars接受字符串为 {input_text}")

    data = {
        "stars":stars_sorted[input_text]
    }
    return jsonify(data)

# 返回openrank
@app.route('/openrank', methods=['POST'])
def get_openrank():
    input_text = request.json.get('inputText')
    print(f"openrank接受字符串为 {input_text}")
    data = {

        "openrank": raw_openrank[input_text]
    }
    return jsonify(data)

# 返回participants
@app.route('/participants', methods=['POST'])
def get_participants():
    input_text = request.json.get('inputText')
    print(f"participants接受字符串为 {input_text}")
    data = {

        "participants": raw_participants[input_text]
    }
    return jsonify(data)

# 启动服务器并监听端口 5000
if __name__ == '__main__':
    root_folder = "../top_300_metrics"
    # 创建 ActivityProcessor 实例
    processor = Activity.ActivityProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict1 = processor.generate_results_dict()

    #创建 StarsProcessor 实例
    processor = Stars.StarsProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict2 = processor.generate_results_dict()

    #创建 AttentionProcessor 实例
    processor = Attention.AttentionProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict3 = processor.generate_results_dict()

    #创建 IssueResolutionDurationProcessor 实例
    processor = Issue_resolution_duration.IssueResolutionDurationProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict4 = processor.generate_results_dict()

    #创建 IssueResponseTime 实例
    processor = Issue_response_time.IssueResponseTimeProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict5 = processor.generate_results_dict()
    # 创建 IssueCommentsProcessor 实例
    processor = Issue_comments.IssueCommentsProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict6 = processor.generate_results_dict()

    # 创建 ChangeRequestResolutionDurationProcessor 实例
    processor = Change_request_resolution_duration.ChangeRequestResolutionDurationProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict7 = processor.generate_results_dict()

    # 创建 ChangeRequestResponseTimeProcessor 实例
    processor = Change_request_response_time.ChangeRequestResponseTimeProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict8 = processor.generate_results_dict()

    # 创建 ParticipantsProcessor 实例
    processor = Participants.ParticipantsProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict9 = processor.generate_results_dict()

    # 创建 OpenrankProcessor 实例
    processor = Openrank.OpenrankProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict10 = processor.generate_results_dict()

    # 创建 TechnicalForkProcessor 实例
    processor = Technical_fork.TechnicalForkProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict11 = processor.generate_results_dict()

    # 创建 NewContributorsProcessor 实例
    processor = New_contributors.NewContributorsProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict12 = processor.generate_results_dict()

    # 创建 InactiveContributorsProcessor 实例
    processor = Inactive_contributors.InactiveContributorsProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    dict13 = processor.generate_results_dict()

    # 创建 NestedDictionaryMerger 类的实例
    merger = Merge.NestedDictionaryMerger()

    # 合并字典
    result = merger.merge(dict1, dict2, dict3, dict4, dict5, dict6, dict7, dict8, dict9, dict10, dict11, dict12, dict13)

    # 创建 ActivityProcessor 实例
    processor = starspro.StarsProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    # 打印结果
    stars_sorted = processor.generate_sorted_results_dict()

    # 创建 OpenrankProcessor 实例
    processor = openrankpro.OpenrankProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    raw_openrank = processor.process_root_folder()

    # 创建 OpenrankProcessor 实例
    processor = participantspro.OpenrankProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    raw_participants = processor.process_root_folder()

    app.run(host='0.0.0.0', port=5000)
