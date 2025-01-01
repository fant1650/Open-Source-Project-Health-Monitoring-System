import json
import os
from collections import defaultdict


class DateIndexData:
    """存储日期和计算的索引"""

    def __init__(self, subfolder_name, date, index):
        self.subfolder_name = subfolder_name
        self.date = date
        self.index = index

    def __repr__(self):
        return f"({self.subfolder_name}, {self.date}, {self.index})"


class IssueResolutionDurationProcessor:
    """处理活动数据，计算索引并存储结果"""

    def __init__(self, root_folder):
        self.root_folder = root_folder
        self.all_results = []

    def load_json(self, file_path):
        """加载 JSON 文件并返回数据"""
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                print(f"Data loaded from {file_path}")  # 打印加载的数据
                # 只提取 'avg' 部分的数据
                return data.get('avg', {})  # 返回 avg 部分，如果没有就返回空字典
        except (json.JSONDecodeError, FileNotFoundError) as e:
            print(f"Error loading {file_path}: {e}")
            return None

    def process_files_in_folder(self, folder_path, folder_name):
        """处理每个文件夹中的 activity.json 文件"""
        date_index_pairs = defaultdict(float)  # 存储日期及其对应的总和
        all_dates = set()  # 存储所有日期

        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if os.path.isdir(file_path):
                continue  # 忽略子文件夹
            elif filename == 'issue_resolution_duration.json':  # 找到目标文件
                print(f"Found target file: {file_path}")
                data = self.load_json(file_path)
                if not data:
                    continue
                # 计算累积总和以及索引
                ts = 0  # 总和
                i = 0  # 序号
                for date, values in data.items():
                    total_sum = values  # 假设 values 已经是一个数字
                    if i == 0:
                        index = 0  # 第一个日期的 index 为 0
                    else:
                        index = total_sum - ts / i  # 使用公式计算 index
                    ts += total_sum  # 更新总和
                    i += 1  # 更新序号

                    # 将结果存储到 all_results 中
                    self.all_results.append(DateIndexData(folder_name, date, index))
                    all_dates.add(date)

        # 填充日期范围之前的 index 为 0
        # 填充2015年1月到2023年3月之间的日期
        all_dates_to_process = set()
        for year in range(2015, 2024):  # 填充2015-2023年的日期
            for month in range(1, 13):
                # 只需要到2023年3月
                if year == 2023 and month > 3:
                    break
                date = f"{year}-{month:02d}"
                all_dates_to_process.add(date)

        # 根据日期排序，确保日期顺序
        sorted_dates = sorted(all_dates_to_process)

        # 处理填充日期之前的数据
        for date in sorted_dates:
            if date not in all_dates:
                self.all_results.append(DateIndexData(folder_name, date, 0))

    def process_root_folder(self):
        """处理根文件夹中的所有子文件夹"""
        for name_folder in os.listdir(self.root_folder):
            name_folder_path = os.path.join(self.root_folder, name_folder)
            if os.path.isdir(name_folder_path):
                for subfolder_name in os.listdir(name_folder_path):
                    subfolder_path = os.path.join(name_folder_path, subfolder_name)
                    if os.path.isdir(subfolder_path):
                        self.process_files_in_folder(subfolder_path, subfolder_name)

    def find_max_index_for_dates(self):
        """查找每个日期的最大 index"""
        date_max_index = defaultdict(float)

        for result in self.all_results:
            date = result.date
            index = abs(result.index)
            if index > date_max_index[date]:
                date_max_index[date] = index

        return date_max_index

    def generate_results_dict(self):
        """生成结果字典"""
        date_max_index = self.find_max_index_for_dates()

        # 创建字典存储项目名称和对应的日期:index 映射
        results_dict = defaultdict(dict)

        # 将所有结果存入字典
        for result in self.all_results:
            normalized_index = result.index
            if date_max_index[result.date]:
                normalized_index = result.index / date_max_index[result.date]
            results_dict[result.subfolder_name][result.date] = normalized_index

        return results_dict

    def print_results(self):
        """打印最终结果"""
        results_dict = self.generate_results_dict()

        if results_dict:
            for subfolder_name, date_index_dict in results_dict.items():
                print(f"\n{subfolder_name}:")
                # 按日期排序输出
                for date in sorted(date_index_dict.keys()):
                    print(f"  {date}: {date_index_dict[date]}")
        else:
            print("No data found.")


def main():
    """主函数，执行所有操作"""
    root_folder = r'C:\Users\cxy\Desktop\project\top_300_metrics'  # 根文件夹路径
    print(f"Processing files in folder: {root_folder}")

    # 创建 ActivityProcessor 实例
    processor = IssueResolutionDurationProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    # 打印结果
    processor.print_results()


if __name__ == '__main__':
    main()