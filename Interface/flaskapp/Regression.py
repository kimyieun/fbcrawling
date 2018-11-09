
# coding: utf-8

# In[325]:


import torch
from torch.autograd import Variable
from sklearn.model_selection import KFold
import torch.nn.functional as F
import numpy as np
import json
import csv
#get_ipython().run_line_magic('matplotlib', 'inline')


# In[349]:

'''
torch.manual_seed(1)
try:
    with open("./Features/Features_data/featuretest.json", encoding='UTF8') as f:
        features = json.load(f)
except EnvironmentError:
    print('No Feature File')

try:
    with open("./Features/Features_data/scoretest.json", encoding='UTF8') as f:
        scores = json.load(f)
except EnvironmentError:
    print("No Score File")

feature_num = 16
x = np.array(features)
print(x.shape)

y = np.array(scores)
y = np.reshape(y,(-1,1))
#y = torch.unsqueeze(y, dim = 1)
print(y.shape)
kf = KFold(n_splits = 5, shuffle = True)
'''

# In[350]:

class Net(torch.nn.Module):
    def __init__(self, layer_list, n_output):
        super(Net, self).__init__()
        self.hidden_list = torch.nn.ModuleList([])
        for idx, value in enumerate(layer_list):
            if idx == len(layer_list) - 1:
                break
            else:
                self.hidden_list.append(torch.nn.Linear(value, layer_list[idx + 1]))
        self.predict = torch.nn.Linear(layer_list[len(layer_list) - 1], n_output) #output layer

    def forward(self, x):
        for idx, value in enumerate(self.hidden_list):
            x = F.relu(self.hidden_list[idx](x))
        x = self.predict(x)             # linear output
        return x
