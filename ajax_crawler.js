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

function getNotiMetadata(list, li){  //get the metadata of a notification
    //1. read / unread
    var unread = JSON.parse($(li).attr("data-gt"))["unread"];
    list["IsRead"] = (unread == 2)? false : true;

    //2. arrival time
    var noti_arrivalTime = $(li).find('div._42ef').find('abbr').attr('data-utime');
    noti_arrivalTime = new Date(+(noti_arrivalTime + '000'));
    var timeDiff = Math.abs(noti_arrivalTime.getTime() - (new Date()).getTime()) / 1000; // seconds
    if(timeDiff <= 3600) list["TimeInterval"] = 1;
    else if(timeDiff > 3600 && timeDiff <= 21600) list["TimeInterval"] = 2;
    else if(timeDiff > 21600 && timeDiff <= 86400) list["TimeInterval"] = 3;
    else if(timeDiff > 86400 && timeDiff <= 604800) list["TimeInterval"] = 4;
    else list["TimeInterval"] = 5;
    
    return list;
};

function getSenderName(list){
    var title = list['Title'];
    if(list['Sender'] == 'User'){
        var re = /(.*)(님의|님이|님 외)/;
        var res = re.exec(title)[1];
        res = res.replace('오늘은 ','').split('님과');
        if(typeof(res) != "object" && res.search('님이') != -1){
            re = /(.*)(님이)/;
            res = re.exec(res)[1];
        }
    }
    else if(list['Sender'] == 'Group'){
        var re = /(명이|님이) (.*) 그룹/;
        var res = re.exec(title)[2];
        res = res.replace(/[가-힣]요일에 /, '');
    }
    else if(list['Sender'] == 'Page'){
        var re = /(이|록) (.*)에 /;
        var res = re.exec(title)[2];
    }
    if(res.length == 1) res = res[0];
    list['SenderName'] = res;
    return list;  
}


function getMedia(list, li, IsGroupActivity){
    var title = list["Title"];
    list["Media"] = [];
    if(title.search('사진') != -1){
        list["Media"].push('Photo');
        var re = /(\d*)장/;
        var res = re.exec(title);
        var photo_cnt = 1;
        if(res != null) photo_cnt = +res[1];
        list["Media"].push(photo_cnt);
    }
    else if(title.search('동영상') != -1){ //post video
        list["Media"].push('Video');
    }
    else{
        list["Media"].push('Text'); //text, link
        //text 길이 추가
        var text_length = 0;
        var content = $(li).find('a').eq(0);
        if(!IsGroupActivity){
            $.ajax(content.attr('href'))
                .done(function(text){
                    var re = /(<div class="hidden_elem">)([\s\S]*?)( -->)/;
                    var res = re.exec(text)[2].split("<!-- ")[1];
                    var d = document.createElement('div');
                    d.innerHTML = res;
                    var text = $(d.firstChild).find('div._5pbx.userContent').find('p');
                    console.log(text + " " + typeof(text));
                    text.each(function(idx){
                        text_length += text[idx].innerHTML.length;
                    });
            });
        }
        else{
            /*
            $.ajax(content.attr('href'))
            .done(function(text){
                var re = /(<div class="hidden_elem">)([\s\S]*?)( -->)/;
                
            });
            */
        }
        list["Media"].push(text_length);
    }
    return list;
}

function getSCL(list, li, IsGroupActivity){ //(IsGroupActivity = true) -> 게시물이 하나만 뜨는것이 아니라서 다르게 접근해야함
    var content = $(li).find('a').eq(0);
    $.ajax(content.attr('href'))
        .done(function(text){
            if(!IsGroupActivity){
                var like_re = /((,|\d)*)명/; //get the number of likes
                var like_res = like_re.exec(text);
                var like_cnt;
                if(like_res == null) like_cnt = 0; 
                else like_cnt = +like_res[1].replace(/,/g,'');
                list["Like"] = like_cnt; 
            }
            else{ //group에 올라온 게시물인 경우


            }
        })
    return list;
}

function getContentInfo(list, li, IsGroupActivity){
    var title = list['Title'];
    list = getMedia(list, li, IsGroupActivity);
    list = getSCL(list, li, IsGroupActivity); //(Share, Comment, Likes)
    return list;
};

function classifyUserActivities(list, li, IsGroupActivity){
    var title = list['Title'];
    if(title.search('언급했습니다') != -1 || title.search('태그했습니다') != -1){ //tag
        list["Activity"] = 'Tag';
        list = getContentInfo(list, li, IsGroupActivity);
    }
    else if(title.search('생일') != -1){ //birthday
        list["Activity"] = 'Birthday';
    }
    else if(title.search('초대') != -1 && title.search('그룹') != -1){ //invitation
        list["Activity"] = 'InviteGroup';
    }
    else if(title.search('방송') != -1){ //Live video
        list["Activity"] = 'Livevideo';
    }
    else if(title.search('페이지') != -1 && title.search('좋아요를 요청') != -1){ //
        list["Activity"] = 'RequestlikeforPage';
    }
    else if(title.search('이벤트') != -1 && title.search('응답') != -1){ //join the event
        list["Activity"] = 'JoinEvent';
    }
    else if(title.search('댓글을 남겼습니다') != -1 || title.search('답글을 남겼습니다') != -1){ //Comment
        list["Activity"] = 'Comment';
    }
    else if(title.search('추억을 공유') != -1){
        list["Activity"] = 'OnThisDay';
    }
    else if(title.search('공유') != -1){ //share
        list["Activity"] = 'Share';
        list = getContentInfo(list, li, IsGroupActivity);
    }
    else if((title.search('상태') != -1 && title.search('업데이트') != -1) || (title.search('업데이트') != -1 && title.search('게시') != -1)){ //status
        list["Activity"] = 'Status';
        list = getContentInfo(list, li, IsGroupActivity);
    }
    else if(title.search('좋아합니다') != -1 || title.search('공감했습니다') != -1){ //like
        list["Activity"] = 'Like';
        list = getContentInfo(list, li, IsGroupActivity);
    }
    else if(title.search('올렸습니다') != -1 || title.search('추가') != -1 || title.search('게시') != -1 || title.search('에 있습니다') != -1){ //post text
        list["Activity"] = 'Post';
        list = getContentInfo(list, li, IsGroupActivity);
    }
    else if(title.search('커버 사진') != -1 || title.search('프로필 사진') != -1){
        list["Activity"] = 'AddorChangeProfile';
    }
    return list;
};

function classifyGroupActivities(list, li){
    var title = list['Title'];
    if(title.search('가입 요청') != -1 && title.search('승인') != -1){ //approve a request to join a group
        list["Activity"] = 'Approve';
    }
    else if(title.search('가입 신청') != -1){ //request to join a group
        list["Activity"] = 'Request';
    }
    else if(title.search('그룹') != -1 && title.search('초대') != -1){ //invitation
        list["Activity"] = 'Invite';
    }
    else if(title.search('그룹 이름') != -1 && title.search('변경') != -1){ //change group name
        list["Activity"] = 'ChangeName';
    }
    else list = classifyUserActivities(list, li, true);
    return list;
};

function classifyPageAcitivites(list, li){
    var title = list['Title'];
    if(title.search('새 이벤트') != -1 && title.search('추가') != -1){ //add an event 
        list['Sender'] = 'LikedPage';
        list["Activity"] = 'AddEvent';
    }
    else if((title.search('알 수 있도록') != -1 && title.search('좋아요를 요청') != -1) || 
    (title.search('늘릴 수 있도록') != -1 && title.search('추가하세요') != -1)){ //recommended action for my pages 
        list['Sender'] = 'MyPage';
        list["Activity"] = 'RecommendationforMypage';
    }
    else if(title.search('페이지') != -1 && title.search('활동') != -1){ //notify the current my page status 
        list['Sender'] = 'MyPage';
        list["Activity"] = 'NotifystatusofMypage';
    }
    else if(title.search('추가') != -1){ //post 
        list['Sender'] = 'LikedPage';
        list["Activity"] = 'Post';
        list = getContentInfo(list, li, false);
    }

    return list;
}

function classifySystemAcitivies(list){
    var title = list['Title'];
    
    if(title.search('친구 추천') != -1){ //recommendation friends 
        list["Activity"] = 'RecommendFriend';
    }
    else if(title.search('동영상') != -1 && title.search('확인') != -1){ // recommendation video
        list["Activity"] = 'RecommendVideo';
    }
    else if(title.search('지역 페이지') != -1 && title.search('새로운 소식') != -1){ //recommendation local pages
        list["Activity"] = 'RecommendLocalpage';
    }
    return list;
}

var lis = document.querySelectorAll('ul > li._33c');
var notifications = [];
var noti_num = 0;


lis.forEach(function(li){
    var noti_title = $(li).find('div._4l_v').find('span').eq(0).text();
    var notification = {};
    notification["Title"] = noti_title;
    console.log(noti_title);
    //notification metadata
    notification = getNotiMetadata(notification, li);
    //notification activity and content classification
    var relationship = JSON.parse($(lis).attr('data-gt'))["notif_type"];
    if(noti_title.search('그룹') != -1){ //Group
        notification['Sender'] = 'Group';
        notification = getSenderName(notification);
        notification = classifyGroupActivities(notification, li);
    }
    else if((noti_title.search('님 외') != -1 && noti_title.search('명이') != -1) || noti_title.search('생일') != -1){ //User
        notification['Sender'] = 'User';
        notification = getSenderName(notification);
        notification = classifyUserActivities(notification, li, false);
    }
    else{ //Page and System
        var IsPage = false;
        if(relationship.search("page") != -1 && relationship.search("subscription") == -1){ //Page
            IsPage = true;
            notification = classifyPageAcitivites(notification, li);
            //My page와 liked page 구별
        }
        else{ //Not Page
            if(noti_title.search('님이') != -1){ //User
                notification['Sender'] = 'User';
                notification = getSenderName(notification);
                notification = classifyUserActivities(notification, li, false);
            }
            else{ //System
                notification['Sender'] = 'System';
                notification = classifySystemAcitivies(notification);
            }
        }
    }
    notifications.push(notification);
});

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  downloadObjectAsJson(notifications, "notifications1");

// var comment_re = /댓글 ((,|\d)*)개/; 
// var comment_res = comment_re.exec(text);
// var comment_cnt;
// if(comment_res == null) comment_cnt = 0;
// else comment_cnt = +comment_res[1].replace(/,/g,'');
// list["Comment"] = comment_cnt;

// var share_re = /공유 ((,|\d)*)회/; 
// var share_res = share_re.exec(text);
// var share_cnt;
// if(share_res == null) share_cnt = 0;
// else share_cnt = +share_res[1].replace(/,/g,'');
// list["Share"] = share_cnt;

