import csv
import json

with open('./Features/Features_data/featuretest.json', encoding="UTF8") as f:
    features = json.load(f)

with open('./Features/Features_data/scoretest.json', encoding="UTF8") as f:
    scores = json.load(f)

i = 0
feature_all = []
for feature in features:
    features_data = [] 
    '''
    #is read
    if(feature[0] == 0) : features_data.append("N")
    else: features_data.append("Y")
    '''
    features_data.append(feature[0]) #time
    
    '''
    #sender
    a, b, c = feature[2], feature[3], feature[4]
    if(a == 1 and b == 0 and c == 0): features_data.append(1)
    elif(a == 0 and b == 1 and c == 0): features_data.append(2)
    elif(a == 0 and b == 0 and c == 1): features_data.append(3)
    else: features_data.append(0)
    '''
    
    #sender
    a, b, c = feature[1], feature[2], feature[3]
    if(a == 1 and b == 0 and c == 0): features_data.append('User')
    elif(a == 0 and b == 1 and c == 0): features_data.append('Group')
    elif(a == 0 and b == 0 and c == 1): features_data.append('System')
    else: features_data.append("Other")

    '''
    #media
    a, b, c = feature[5], feature[6], feature[7]
    if(a == 1 and b == 0 and c == 0): features_data.append(1)
    elif(a == 0 and b == 1 and c == 0): features_data.append(2)
    elif(a == 0 and b == 0 and c == 1): features_data.append(3)
    else: features_data.append(0)
    '''
    
    #media
    a, b, c = feature[4], feature[5], feature[6]
    if(a == 1 and b == 0 and c == 0): features_data.append("Text")
    elif(a == 0 and b == 1 and c == 0): features_data.append("Photo")
    elif(a == 0 and b == 0 and c == 1): features_data.append("Video")
    else: features_data.append("not media")

    #photonum
    features_data.append(feature[7])
    '''
    #relationship
    a, b, c, d = feature[9], feature[10], feature[11], feature[12]
    if(a == 1 and b == 0 and c == 0 and d == 0): features_data.append(1)
    elif(a == 0 and b == 1 and c == 0 and d == 0): features_data.append(2)
    elif(a == 0 and b == 0 and c == 1 and d == 0): features_data.append(3)
    elif(a == 0 and b == 0 and c == 0 and d == 1): features_data.append(4)
    else: features_data.append(0)
    '''

    #relationship
    #print(len(feature), feature)
    a, b, c, d = feature[8], feature[9], feature[10], feature[11]
    if(a == 1 and b == 0 and c == 0 and d == 0): features_data.append("Friend")
    elif(a == 0 and b == 1 and c == 0 and d == 0): features_data.append("Close_friend")
    elif(a == 0 and b == 0 and c == 1 and d == 0): features_data.append("Other")
    elif(a == 0 and b == 0 and c == 0 and d == 1): features_data.append("Joined")
    else: features_data.append("System")

    #mutual friends
    features_data.append(feature[12])
    
    #close / public
    if(feature[13] == 0): features_data.append("closed")
    else: features_data.append("public")
    
    #contain myself
    if(feature[14] == 0) : features_data.append("N")
    else: features_data.append("Y")

    #intimacy
    features_data.append(feature[15])

    print(scores[i])
    features_data.append(scores[i])
    i = i + 1
    feature_all.append(features_data)

with open("./Features/features_data.csv", "w") as output:
    writer = csv.writer(output, lineterminator='\n')
    writer.writerows(feature_all)


    