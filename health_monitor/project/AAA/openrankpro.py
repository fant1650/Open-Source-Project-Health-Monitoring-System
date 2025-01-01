import json
import os
from collections import defaultdict


class OpenrankProcessor:
    """处理活动数据，生成和返回结果字典"""

    def __init__(self, root_folder):
        self.root_folder = root_folder

    def load_json(self, file_path):
        """加载 JSON 文件并返回字典"""
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                print(f"Data loaded from {file_path}")  # 打印加载的数据
                return data
        except (json.JSONDecodeError, FileNotFoundError) as e:
            print(f"Error loading {file_path}: {e}")
            return None

    def process_files_in_folder(self, folder_path, folder_name):
        """处理每个文件夹中的 openrank.json 文件"""
        results_dict = defaultdict(dict)  # 存储项目名称和对应的日期:index 映射

        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if os.path.isdir(file_path):
                continue  # 忽略子文件夹
            elif filename == 'openrank.json':  # 找到目标文件
                print(f"Found target file: {file_path}")
                data = self.load_json(file_path)
                if not data:
                    continue
                # 将数据直接存入结果字典
                for date, values in data.items():
                    results_dict[folder_name][date] = values

        return results_dict

    def process_root_folder(self):
        """处理根文件夹中的所有子文件夹"""
        all_results = defaultdict(dict)

        for name_folder in os.listdir(self.root_folder):
            name_folder_path = os.path.join(self.root_folder, name_folder)
            if os.path.isdir(name_folder_path):
                for subfolder_name in os.listdir(name_folder_path):
                    subfolder_path = os.path.join(name_folder_path, subfolder_name)
                    if os.path.isdir(subfolder_path):
                        subfolder_results = self.process_files_in_folder(subfolder_path, subfolder_name)
                        # 将每个子文件夹的结果合并到总结果字典中
                        all_results.update(subfolder_results)

        return all_results

    def print_results(self, results_dict):
        """打印最终结果"""
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

    # 创建 OpenrankProcessor 实例
    processor = OpenrankProcessor(root_folder)

    # 处理根文件夹中的所有子文件夹
    results_dict = processor.process_root_folder()

    # 打印结果
    print(results_dict)


if __name__ == '__main__':
    main()
