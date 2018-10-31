import csv
import json

for i in range(1, 24):
    with open('./Features/' + str(i) + '_score.csv', encoding="UTF8") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        interestingness_score = []
        closeness_score = []
        for row in csv_reader:
            interestingness_score.append(float(row[3]))
            closeness_score.append(float(row[4]))
            line_count += 1
    #print(interestingness_score)
    #print(closeness_score)

    with open('./Features/' + str(i) + '_data.json', encoding="UTF8") as f:
        notifications = json.load(f)

    with open('./Features/' + str(i) + '_score_vector_test.json', 'w') as outfile:
        json.dump(interestingness_score, outfile)


    cnt = 0
    for noti in notifications:
        #for test
        noti['Interestingness_score'] = interestingness_score[cnt]
        #for test
        noti['Closeness_score'] = closeness_score[cnt]
        cnt += 1

    with open('./Features/' + str(i) + '_data.json', 'w', encoding="UTF8") as f:
        json.dump(notifications, f, ensure_ascii=False)    

