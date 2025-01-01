from collections import defaultdict

# 各个字典对应的权重
q1 = 0.1
q2 = 0.1
q3 = 0.1
q4 = 0.1
q5 = 0.1
q6 = 0.1
q7 = 0.1
q8 = 0.1
q9 = 0.1
q10 = 0.1
q11 = 0.1
q12 = 0.1
q13 = 0.1


class NestedDictionaryMerger:
    """合并带有子字典的字典，并对相同的键进行合并（值相加）"""

    def __init__(self):
        # 初始化一个 defaultdict, 默认值为 dict
        self.merged_dict = defaultdict(lambda: defaultdict(int))

    def merge(self, dict1, dict2, dict3, dict4, dict5, dict6, dict7, dict8, dict9, dict10, dict11, dict12, dict13):
        """合并多个嵌套字典，并按权重加和"""
        # 合并 dict1
        for project, dates in dict1.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q1 * value

        # 合并 dict2
        for project, dates in dict2.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q2 * value

        # 合并 dict3
        for project, dates in dict3.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q3 * value

        # 合并 dict4
        for project, dates in dict4.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q4 * value

        # 合并 dict5
        for project, dates in dict5.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q5 * value

        # 合并 dict6
        for project, dates in dict6.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q6 * value

        # 合并 dict7
        for project, dates in dict7.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q7 * value

        # 合并 dict8
        for project, dates in dict8.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q8 * value

        # 合并 dict9
        for project, dates in dict9.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q9 * value

        # 合并 dict10
        for project, dates in dict10.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q10 * value

        # 合并 dict11
        for project, dates in dict11.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q11 * value

        # 合并 dict12
        for project, dates in dict12.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q12 * value

        # 合并 dict13
        for project, dates in dict13.items():
            for date, value in dates.items():
                self.merged_dict[project][date] += q13 * value

        # 返回合并后的字典
        return {project: dict(dates) for project, dates in self.merged_dict.items()}

    def get_merged_dict(self):
        """获取当前合并的字典"""
        return {project: dict(dates) for project, dates in self.merged_dict.items()}


# 示例数据字典
dict1 = {"项目1": {"2024-06": 10}}
dict2 = {"项目1": {"2024-06": 5}, "项目2": {"2024-07": 8}}
dict3 = {"项目2": {"2024-07": 6}, "项目3": {"2024-08": 7}}
dict4 = {"项目1": {"2024-06": 3}, "项目2": {"2024-07": 9}}
dict5 = {"项目1": {"2024-06": 2}, "项目3": {"2024-08": 4}}
dict6 = {"项目2": {"2024-07": 4}, "项目3": {"2024-08": 2}}
dict7 = {"项目1": {"2024-06": 1}, "项目3": {"2024-08": 1}}
dict8 = {"项目2": {"2024-07": 3}, "项目3": {"2024-08": 5}}
dict9 = {"项目1": {"2024-06": 4}, "项目3": {"2024-08": 6}}
dict10 = {"项目2": {"2024-07": 5}, "项目3": {"2024-08": 8}}
dict11 = {"项目1": {"2024-06": 6}, "项目2": {"2024-07": 7}}
dict12 = {"项目3": {"2024-08": 9}, "项目2": {"2024-07": 2}}
dict13 = {"项目1": {"2024-06": 8}, "项目2": {"2024-07": 9}}

# 创建 NestedDictionaryMerger 类的实例
merger = NestedDictionaryMerger()

# 合并字典
result = merger.merge(dict1, dict2, dict3, dict4, dict5, dict6, dict7, dict8, dict9, dict10, dict11, dict12, dict13)

# 输出合并后的字典
print(result)
