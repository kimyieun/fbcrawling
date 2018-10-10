/*
notifications = [
    noti1, noti2, noti3 ...
]

notification = {
    "Title" : string, 
    "TimeInterval" : number(1~5), 
    "IsRead" : boolean, 
    "Sender" : string(user, group, page, system),
    "SenderName" : string array
    "Relationship" : [], e.g., ["close", 15], ["Joined", "Closed"]
    "Acitivity" : string, 
    "Media" : [string, number],
    "Likes" : number, 
}
*/

function getNotiMetadata(list, li) {  //get the metadata of a notification
    //1. read / unread
    var unread = JSON.parse($(li).attr("data-gt"))["unread"];
    list["IsRead"] = (unread == 2) ? false : true;

    //2. arrival time
    var noti_arrivalTime = $(li).find('div._42ef').find('abbr').attr('data-utime');
    noti_arrivalTime = new Date(+(noti_arrivalTime + '000'));
    var timeDiff = Math.abs(noti_arrivalTime.getTime() - (new Date()).getTime()) / 1000; // seconds
    if (timeDiff <= 3600) list["TimeInterval"] = 1;
    else if (timeDiff > 3600 && timeDiff <= 21600) list["TimeInterval"] = 2;
    else if (timeDiff > 21600 && timeDiff <= 86400) list["TimeInterval"] = 3;
    else if (timeDiff > 86400 && timeDiff <= 604800) list["TimeInterval"] = 4;
    else list["TimeInterval"] = 5;

    return list;
};

function getSenderName(list) {
    var title = list['Title'];
    if (list['Sender'] == 'User') {
        var re = /(.*)(님의|님이|님 외|님과|님도)/;
        var res = re.exec(title)[1];
        res = res.replace('오늘은 ', '').replace('과거의 오늘 ', '').split('님,|님과|님도');
        if (typeof (res) == "object" && res[0].search('님,|님이|,|님도|님과') != -1) {
            re = /(.*?)(님,|님이|,|님도|님과)/;
            res = re.exec(res[0])[1];
        }
    }
    else if (list['Sender'] == 'Group') {
        var re = /(명이|님이) (.*) 그룹/;
        var res = re.exec(title)[2];
        res = res.replace(/[가-힣]요일에 /, '');
    }
    else if (list['Sender'] == 'Page') {
        var re = /(이|록) (.*)에 /;
        var res = re.exec(title)[2];
    }
    if (res.length == 1) res = res[0];
    list['SenderName'] = res;
    return list;
}


function getMedia(list, li) {
    var title = list["Title"];
    var sender = list['Sender'];
    list["Media"] = [];
    if (title.search('사진') != -1) {
        list["Media"].push('Photo');
        var re = /(\d*)장/;
        var res = re.exec(title);
        var photo_cnt = 1;
        if (res != null) photo_cnt = +res[1];
        list["Media"].push(photo_cnt);
    }
    else if (title.search('동영상') != -1) { //post video
        list["Media"].push('Video');
    }
    else {
        list["Media"].push('Text'); //text, link
        //text 길이 추가
        var text_length = 0;
        var content = $(li).find('a').eq(0);
        var addr = content.attr('href');
        if (sender != "Group") {
            $.ajax(addr)
                .done(function (text) {
                    var re = /(<div class="hidden_elem">)([\s\S]*?)( -->)/;
                    var res = re.exec(text)[2].split("<!-- ")[1];
                    var d = document.createElement('div');
                    d.innerHTML = res;
                    var text = $(d.firstChild).find('div._5pbx.userContent').find('p');
                    text.each(function (idx) {
                        text_length += text[idx].innerHTML.length;
                    });
                    list["Media"].push(text_length);
                });
        }
        else {
            var re = /(multi_permalinks=)(\d*)(%|&notif_id)/;
            //console.log(title + " "  + addr + " " + re.exec(addr));
            var id = re.exec(addr)[2];
            $.ajax(addr)
                .done(function (text) {
                    var re = /(<div class="hidden_elem">)(.*)/g;
                    var res_list = text.match(re);
                    var res;
                    res_list.forEach(function (d) {
                        if (d.search("알림 소식") != -1 || d.search("하이라이트") != -1) res = d;
                    });
                    //console.log("title : " + title + "  res : " + res);
                    res = res.split("<!--")[1];
                    res = $(res).find('[id^="mall_post_"]');
                    var post;
                    res.each(function (idx) {
                        var id_value = res[idx].attributes.id.value;
                        if (id_value.search(id) != -1) post = res[idx];
                    });
                    text_length = $(post).find('div._5pbx.userContent').find('p').text().length;
                    list["Media"].push(text_length);
                });
        }
    }
    return list;
}

function getLikes(list, li) {
    var content = $(li).find('a').eq(0);
    var addr = content.attr('href');
    var sender = list['Sender'];
    $.ajax(addr)
        .done(function (text) {
            if (sender != "Group") {
                var like_re = /({current:{text:")(.*)(명"},)/; //get the number of likes
                var like_res = like_re.exec(text);
                var like_cnt;
                if (like_res == null) like_cnt = 0;
                else {
                    if (like_res[2].search("외") != -1) {
                        like_re = /(외 )((,|\d)*)/;
                        like_cnt = +(like_re.exec(like_res[2])[2]);
                    }
                    else like_cnt = +like_res[2].replace(/,/g, '');
                }
                list["Like"] = like_cnt;
            }
            else {
                var title = list['Title'];
                console.log(title);
                var name_re = /(.*?)((, )|님)/;
                name_res = name_re.exec(title)[1];
                re = new RegExp("(,actorname:\"" + name_res + ")" + "(.*)" + "(명\"})", "g");
                text = re.exec(text);
                if (text == null) {
                    list["Memo"] = "Can not get the user's post";
                    return list;
                }
                else text = text[0];
                var like_re = /(reactionsentences:{current:{text:")(.*?)(null|(명"},alternate))/; //get the number of likes
                var like_res = text.match(like_re);
                if (like_res == null) like_cnt = 0;
                else {
                    //console.log(like_res);
                    text = like_res[0];
                    if (text.search("외") != -1) {
                        like_re = /(외 )((,|\d)*)/;
                        like_res = like_re.exec(text);
                        if (like_res == null) like_cnt = 0;
                        else like_cnt = +like_res[2];
                    }
                    else {
                        like_re = /((,|\d)*)(명)/;
                        like_res = like_re.exec(text);
                        if (like_res == null) like_cnt = 0;
                        else like_cnt = +like_res[1];
                    }
                }
                list["Like"] = like_cnt;
            }
        })
    return list;
}

function getContentInfo(list, li) {
    var title = list['Title'];
    list = getMedia(list, li);
    if (title.search("앨범") == -1) list = getLikes(list, li); 
    return list;
};

function getContentOwner(list){
    var title = list['Title'];
    if(title.search("회원님") != -1) list["ContainUser"] = 1;
    else list["ContainUser"] = 0;
    return list;
};

function classifyUserActivities(list, li) {
    var title = list['Title'];
    if (title.search('언급했습니다') != -1 || title.search('태그했습니다') != -1) { //tag
        list["Activity"] = 'Tag';
        list = getContentInfo(list, li);   
        list = getContentOwner(list);
    }
    else if(title.search('안전하다고') != -1){
        list["Activity"] = 'crisis_status';
    }
    else if (title.search('생일') != -1) { //birthday
        list["Activity"] = 'Birthday';
    }
    else if (title.search('초대') != -1 && title.search('그룹') != -1) { //invitation
        list["Activity"] = 'InviteGroup';
    }
    else if (title.search('방송') != -1) { //Live video
        list["Activity"] = 'Livevideo';
    }
    else if (title.search('페이지') != -1 && title.search('좋아요를 요청') != -1) { //
        list["Activity"] = 'RequestlikeforPage';
    }
    else if (title.search('이벤트') != -1 && title.search('근처') != -1) { //join the event
        list["Activity"] = 'JoinEvent';
    }
    else if (title.search('댓글을 남겼습니다') != -1 || title.search('답글을 남겼습니다') != -1) { //Comment
        list["Activity"] = 'Comment';
        list = getContentOwner(list);
    }
    else if (title.search('공유') != -1) { //share
        list["Activity"] = 'Share';
        list = getContentInfo(list, li);
        list = getContentOwner(list);
    }
    /*
    else if (title.search('추억') != -1) {
        list["Activity"] = 'OnThisDay';
    }
    */
    else if ((title.search('상태') != -1 && title.search('업데이트') != -1) || (title.search('업데이트') != -1 && title.search('게시') != -1)) { //status
        list["Activity"] = 'Status';
        list = getContentInfo(list, li);
    }
    else if (title.search('좋아합니다') != -1 || title.search('공감했습니다') != -1) { //like
        list["Activity"] = 'Like';
        list = getContentInfo(list, li);
        list = getContentOwner(list);
    }
    else if (title.search('올렸습니다') != -1 || title.search('추가') != -1 || title.search('게시') != -1 || title.search('에 있습니다|에 있었습니다') != -1) { //post text
        list["Activity"] = 'Post';
        list = getContentInfo(list, li);
        list = getContentOwner(list);
    }
    else if (title.search('커버 사진') != -1 || title.search('프로필 사진') != -1) {
        list["Activity"] = 'AddorChangeProfile';
        list = getContentInfo(list, li);
    }
    else if(title.search('이벤트에 초대') != -1){
        list["Activity"] = 'InviteEvent';
        //list = getContentInfo(list, li); 
    }
    else if(title.search('소통') != -1){
        list["Activity"] = 'MessageRequest';
    }
    else list["Activity"] = null;
    return list;
};

function classifyGroupActivities(list, li) {
    var title = list['Title'];
    if (title.search('가입 요청') != -1 && title.search('승인') != -1) { //approve a request to join a group
        list["Activity"] = 'Approve';
    }
    else if (title.search('가입 신청') != -1) { //request to join a group
        list["Activity"] = 'Request';
    }
    else if (title.search('그룹') != -1 && title.search('초대') != -1) { //invitation
        list["Activity"] = 'Invite';
    }
    else if (title.search('그룹 이름') != -1 && title.search('변경') != -1) { //change group name
        list["Activity"] = 'ChangeName';
    }
    else list = classifyUserActivities(list, li);
    return list;
};

function classifyPageAcitivites(list, li, relationship) {
    var title = list['Title'];
    if (title.search('새 이벤트') != -1 && title.search('추가') != -1) { //add an event 
        list["Activity"] = 'AddEvent';
        list['Relationship'] = 'LikedPage';
    }
    else if ((title.search('알 수 있도록') != -1 && title.search('좋아요를 요청') != -1) ||
        (title.search('늘릴 수 있도록') != -1 && title.search('추가하세요') != -1) || list["notiType"] == "aymt_upsell_tip") { //recommended action for my pages 
        list["Activity"] = 'RecommendationforMypage';
        list['Relationship'] = 'MyPage';
    }
    else if ((title.search('페이지') != -1 && title.search('활동') != -1) || title.search('기록') != -1) { //notify the current my page status 
        list["Activity"] = 'NotifystatusofMypage';
        list['Relationship'] = 'MyPage';
    }
    else if (title.search('추가') != -1) { //post 
        list["Activity"] = 'Post';
        list['Relationship'] = 'LikedPage';
        list = getContentInfo(list, li);
    }
    else if(relationship == "page_fan"){
        list["Activity"] = 'LikePage';
        list['Relationship'] = 'MyPage';
    }
    else{
        list['Relationship'] = 'MyPage';
        list = classifyUserActivities(list, li);
    }
    return list;
}

function classifySystemAcitivies(list, relationship) {
    var title = list['Title'];
    if (title.search('친구 추천') != -1) { //recommendation friends 
        list["Activity"] = 'RecommendFriend';
    }
    else if (title.search('동영상') != -1 && title.search('확인') != -1) { // recommendation video
        list["Activity"] = 'RecommendVideo';
    }
    else if(relationship.search("event_weekly_digest") != -1){
        list["Activity"] = 'RecommendEvent';
    }
    else if (title.search('지역 페이지') != -1 && title.search('새로운 소식') != -1) { //recommendation local pages
        list["Activity"] = 'RecommendLocalpage';
    }
    else if(title.search('과거') != -1){
        list["Activity"] = 'OnThisDay';
    }
    else if(title.search('친구 요청') != -1){
        list["Acitivity"] = 'FriendRequestReminder';
    }
    else if(title.search('알림:') != -1){
        list["Acitivity"] = 'NotifyEvent';
    }
    else list["Activity"] = null;
    return list;
}

function getGroupAttr(notification, li) {
    var content = $(li).find('a').eq(0);
    $.ajax(content.attr('href'))
        .done(function (text) {
            var g_factor = $(text).find('div._19s_').text();
            if (g_factor.search('비공개') != -1) notification['Relationship'] = ["Closed"];
            else notification['Relationship'] = ["Public"];
        })

    return notification;
}

var lis = document.querySelectorAll('ul[data-testid="see_all_list"] > li');
var notifications = [];
var noti_num = 0;


lis.forEach(function (li) {
    try {
        var noti_title = $(li).find('div._4l_v').find('span').eq(0).text();
        var notification = {};
        notification["Title"] = noti_title;
        //notification metadata
        notification = getNotiMetadata(notification, li);
        //notification activity and content classification
        var relationship = JSON.parse($(li).attr('data-gt'))["notif_type"];
        notification["notiType"] = relationship;
        if (noti_title.search('그룹') != -1) { //Group
            notification['Sender'] = 'Group';
            notification = getSenderName(notification);
            notification = classifyGroupActivities(notification, li);
            notification = getGroupAttr(notification, li);
        }
        else if (((noti_title.search('님 외') != -1 && noti_title.search('명이|명도') != -1) || noti_title.search('생일') != -1) && relationship.search('page') == -1) { //User
            notification['Sender'] = 'User';
            notification = getSenderName(notification);
            notification = classifyUserActivities(notification, li);
        }
        else { //Page and System
            var IsPage = false;
            if ((relationship.search("page") != -1 && relationship.search("subscription") == -1) || relationship.search("event_calendar_create") != -1) { //Page
                IsPage = true;
                notification['Sender'] = 'Page';
                notification = classifyPageAcitivites(notification, li, relationship);
                //My page와 liked page 구별
            }
            else { //Not Page
                if (noti_title.search('님이') != -1 || noti_title.search('님과') != -1 || noti_title.search('님도') != -1) { //User
                    notification['Sender'] = 'User';
                    notification = getSenderName(notification);
                    notification = classifyUserActivities(notification, li);
                }
                else { //System
                    notification['Sender'] = 'System';
                    notification = classifySystemAcitivies(notification, relationship);
                }
            }
        }
        notifications.push(notification);
    } catch (e) {
        console.log(e);
    }
});

/*
// 사용자가 notification interestingness 평가하기 위해서 notification title 받아오는 기능

notititles = [];
notifications.forEach(function(d){
    return notititles.push(d['Title']);
});

var csvContent = "data:text/csv;charset=utf-8,";
notititles.forEach(function(title){
   csvContent += title + "\r\n";
}); 

var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "9_" + "noti_titles.txt");
link.innerHTML= "Click Here to download";
document.body.appendChild(link); // Required for FF

link.click();
*/

/*

  function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  downloadObjectAsJson(notifications, "9_" + "notifications");

*/
