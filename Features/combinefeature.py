import json

features_vector = []
scores_vector = []
for i in range(1, 24):
    with open( "./Features/" + str(i) + "_feature_vector_test.json", encoding='UTF8' ) as f :
            features = json.load(f)
    with open( "./Features/" + str(i) + "_score_vector_test.json", encoding='UTF8' ) as f :
            scores = json.load(f)

    print(len(features), len(scores))
    for feature in features:
        features_vector.append(feature)
    for score in scores:
        scores_vector.append(score)

with open('./Features/Features_data/featuretest.json', 'w', encoding="UTF8") as f:
        json.dump(features_vector, f, ensure_ascii=False)   
                
with open('./Features/Features_data/scoretest.json', 'w', encoding="UTF8") as f:
        json.dump(scores_vector, f, ensure_ascii=False) 