import pandas
from statsmodels.formula.api import ols

data = pandas.read_csv('./Features/features_data.csv')
model = ols('score ~ time + sender + media + photonum + relationship + mutual_friends + close_public + include_myself + intimacy', data).fit()
print(model.summary())