import json
from pprint import pprint

try:
    with open( "./Features/data.json", encoding='UTF8' ) as f :
        notifications = json.load(f)
        
except EnvironmentError: # parent of IOError, OSError *and* WindowsError where available
    print('NoFile')

def TimeInterval(x):
    return {
        1 : [1, 0, 0, 0, 0],
        2 : [0, 1, 0, 0, 0],
        3 : [0, 0, 1, 0, 0],
        4 : [0, 0, 0, 1, 0],
        5 : [0, 0, 0, 0, 1]
    }.get(x, [0, 0, 0, 0, 0])

def Sender(x):
    return {
        "User" : [1, 0, 0, 0],
        "Group" : [0, 1, 0, 0],
        "Page" : [0, 0, 1, 0],
        "System" : [0, 0, 0, 1]
    }.get(x, [0, 0, 0, 0])

def Activity(x):
    return {
        "Birthday" : [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "InviteGroup" : [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Livevideo" : [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "RequestlikeforPage" : [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "JoinEvent" : [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Comment" : [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Share" : [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Status" : [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Like" : [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Tag" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Post" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "AddorChangeProfile" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "InviteEvent" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "MessageRequest" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Approve" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Request" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Invite" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "ChangeName" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "AddEvent" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "RecommendationforMypage" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        "NotifystatusofMypage" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        "LikePage" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        "RecommendFriend" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        "RecommendVideo" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        "RecommendLocalpage" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        "OnThisDay" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        "FriendRequestReminder" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        "NotifyEvent" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    }.get(x, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

vectorSet = []
for noti in notifications:
    featurevector = []
    if "IsRead" in noti:
        if noti["IsRead"] == "True":
            featurevector.append(1)
        else:
            featurevector.append(0)
    else:
        featurevector.append(0)

    if "TimeInterval" in noti:
        featurevector += TimeInterval(noti["TimeInterval"])   
    else:
        featurevector += [0, 0, 0, 0, 0]

    if "Sender" in noti:
        featurevector += Sender(noti["Sender"])
    else:
        featurevector += [0, 0, 0, 0]

    if "Activity" in noti:
        featurevector += Activity(noti["Activity"])
    else:
        featurevector += [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    if "Likes" in noti:
        featurevector.append(noti["Likes"])
    else: 
        featurevector.append(0)

    if "Media" in noti: #Media type and (text length or photo number)
        if len(noti["Media"]) > 1 and noti["Media"][0] == "Text":
            featurevector += [1, 0, 0]
            featurevector += [noti["Media"][1], 0, 0] #text length
        elif len(noti["Media"]) > 1 and noti["Media"][0] == "Photo":
            featurevector += [0, 1, 0]
            featurevector += [0, noti["Media"][1], 0] #the number of photos
        elif len(noti["Media"]) > 1 and noti["Media"][0] == "Video":
            featurevector += [0, 0, 1]
            featurevector += [0, 0, noti["Media"][1]]
        else:
            featurevector += [0, 0, 0, 0, 0, 0]
    else:
        featurevector += [0, 0, 0, 0, 0, 0]

    if "Relationship" in noti: #Relationship
        if noti["Relationship"] == "MyPage":
            featurevector += [0, 0, 0, 1, 0]
        elif noti["Relationship"] == "LikedPage":
            featurevector += [0, 0, 0, 0, 1]
        elif len(noti["Relationship"]) > 0 and noti["Relationship"][0] == "친구":
            featurevector += [1, 0, 0, 0, 0]
        elif len(noti["Relationship"]) > 0 and noti["Relationship"][0] == "친한친구":
            featurevector += [0, 1, 0, 0, 0]
        elif len(noti["Relationship"]) > 1 and noti["Relationship"][1] == "Joined":
            featurevector += [0, 0, 1, 0, 0]
        else:
            featurevector += [0, 0, 0, 0, 0]
    else:
        featurevector += [0, 0, 0, 0, 0]
    
    if "Relationship" in noti: #Mutual friends
        if len(noti["Relationship"]) > 1 and (noti["Relationship"][0] == "친구" or noti["Relationship"][0] == "친한친구"):
            featurevector.append(noti["Relationship"][1])
        else:
            featurevector.append(0)
    else:
        featurevector.append(0)
    
    if "Relationship" in noti: #Group Attribute(closed/public)
        if noti["Sender"] == "Group" and len(noti["Relationship"]) > 1 and noti["Relationship"][0] == "Closed":
            featurevector.append(0)
        else:
            featurevector.append(1)
    else:
        featurevector.append(0) 
    vectorSet.append(featurevector)
with open('feature_vector.json', 'w') as outfile:
    json.dump(vectorSet, outfile)



