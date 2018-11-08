from flask import Flask, redirect, url_for, request, render_template, render_template_string
from flask.json import jsonify
import json, sys
from Regression import Net
import torch, time
from torch.autograd import Variable
from sklearn.model_selection import KFold
import torch.nn.functional as F
import numpy as np

app = Flask(__name__)

json_data = open("../UserStudy/NotiData/0_data.json", encoding='UTF8').read()
noti = json.loads(json_data)
odd_noti = [d for i, d in enumerate(noti) if i%2 != 0]
even_noti = [d for i, d in enumerate(noti) if i%2 == 0]

odd_html = [d["HTML"] for i, d in enumerate(odd_noti)]
even_html = [d["HTML"] for i, d in enumerate(even_noti)]

model = torch.load('../../model.pt')
model.train(False)

#sort interestingness score order
odd_data = torch.tensor([d["Feature"] for i, d in enumerate(odd_noti)])
odd_score = model(odd_data).detach().numpy() #unsorted score list

for i, noti in enumerate(odd_noti):
    noti["Score"] = odd_score[i]

odd_score = np.array(odd_score).flatten()
sorted_idx = odd_score.argsort()[::-1][:len(odd_noti)] #sort descending order
sorted_odd_noti = [odd_noti[i] for i in sorted_idx]

@app.route('/list1')
def list1():
    return render_template('options.html', options=sorted_odd_noti)

@app.route('/list2')
def list2():
    return render_template('options.html', options=even_noti)

if __name__ == '__main__':
    app.run(debug=True)