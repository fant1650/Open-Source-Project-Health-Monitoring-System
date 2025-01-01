import json
import os
from collections import defaultdict


class DateIndexData:
    """存储日期和计算的索引"""

    def __init__(self, subfolder_name, date):
        self.subfolder_name = subfolder_name
        self.date = date

    def __repr__(self):
        return f"({self.subfolder_name}, {self.date})"


class StarsProcessor:
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
                return data
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
            elif filename == 'stars.json':  # 找到目标文件
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
                self.all_results.append(DateIndexData(folder_name, ts))

    def process_root_folder(self):
        """处理根文件夹中的所有子文件夹"""
        for name_folder in os.listdir(self.root_folder):
            name_folder_path = os.path.join(self.root_folder, name_folder)
            if os.path.isdir(name_folder_path):
                for subfolder_name in os.listdir(name_folder_path):
                    subfolder_path = os.path.join(name_folder_path, subfolder_name)
                    if os.path.isdir(subfolder_path):
                        self.process_files_in_folder(subfolder_path, subfolder_name)

    def generate_sorted_results_dict(self):
        """根据总和生成排序后的结果字典"""
        # 使用 sorted() 对结果进行排序，按 date（总和）进行排序
        sorted_results = sorted(self.all_results, key=lambda x: x.date, reverse=True)

        # 创建字典存储排序后的项目名称和对应的总和
        sorted_results_dict = {result.subfolder_name: result.date for result in sorted_results}

        return sorted_results_dict

    def print_results(self):
        """打印最终排序后的结果字典"""
        sorted_results_dict = self.generate_sorted_results_dict()
        print(sorted_results_dict)


def main():
    """主函数，执行所有操作"""
    root_folder = r'C:\Users\cxy\Desktop\project\top_300_metrics'  # 根文件夹路径
    print(f"Processing files in folder: {root_folder}")

    # 创建 ActivityProcessor 实例
    processor = StarsProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    processor.process_root_folder()

    # 打印结果
    processor.print_results()


if __name__ == '__main__':
    main()
