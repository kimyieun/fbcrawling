
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
    def __init__(self, n_feature, n_hidden, n_output):
        super(Net, self).__init__()
        self.hidden = torch.nn.Linear(n_feature, n_hidden)   # hidden layer
        self.hidden2 = torch.nn.Linear(n_hidden, 10)   # hidden layer
        #self.hidden3 = torch.nn.Linear(n_hidden, n_hidden)   # hidden layer
        self.predict = torch.nn.Linear(10, n_output)   # output layer

    def forward(self, x):
        x = F.relu(self.hidden(x))      # activation function for hidden layer
        x = F.relu(self.hidden2(x))      # activation function for hidden layer
        #x = F.relu(self.hidden3(x))      # activation function for hidden layer
        x = self.predict(x)             # linear output
        return x
