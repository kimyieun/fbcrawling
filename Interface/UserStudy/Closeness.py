import csv
import json

for i in range(0, 1):
    with open('./Interface/UserStudy/ClosenessData/' + str(i) + ' - Sheet1.csv', encoding="UTF8") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        closeness_score = []
        for row in csv_reader:
            closeness_score.append(float(row[1]))
            line_count += 1

    with open('./Interface/UserStudy/NotiData/' + str(i) + '_data.json', encoding="UTF8") as f:
        notifications = json.load(f)

    cnt = 0
    for noti in notifications:
        noti['Closeness_score'] = closeness_score[cnt]
        cnt += 1

    with open('./Interface/UserStudy/NotiData/' + str(i) + '_data.json', 'w', encoding="UTF8") as f:
        json.dump(notifications, f, ensure_ascii=False)    