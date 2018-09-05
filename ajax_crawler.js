/*
notifications = [
    noti1, noti2, noti3 ...
]

notification = {
    "Title" : string, 
    "TimeInterval" : number(1~5), 
    "IsRead" : boolean, 
    "Sender" : string(user, group, page, system),
    "Relationship" : [], e.g., ["close", 15], ["Joined", "Closed"]
    "Acitivity" : string, 
    "Media" : [string, number],
    "Share" : number, 
    "Comment" : number, 
    "Likes" : number, 
}
*/

function getNotiMetadata(list, li){  //get the metadata of a notification
    //1. read / unread
    var noti_status = $(li).find('ul._55mc').find('div._55m9').attr('aria-label');
    if(noti_status == '읽은 상태로 표시') list["IsRead"] = false;
    else list["IsRead"] = true;

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

function getGroupInfo(list, li){
    //get group factors (public / closed)
    var content = $(li).find('a').eq(0);
    $.ajax(content.attr('href'))
        .done(function(text){
            var re = /([가-힣]*) 그룹/g;
            var res = re.exec(text)[1];
            if(res == '비공개' || res == '비밀') list['Relationship'].push('Closed');
            else list['Relationship'].push('Public');
        })
    return list;
}

var ordinary_groupname = JSON.parse(localStorage['ordinary_groupname']);
var favorite_groupname = JSON.parse(localStorage['favorite_groupname']);
function getGroupRelationship(list, li){
    var title = list['Title'];
    list["Relationship"] = [];
    var IsJoined = false;
    ordinary_groupname.forEach(function(group){
        if(title.search(group) != -1){
            IsJoined = true;
            list["Relationship"].push("Joined");
        }
    });
    if(!IsJoined) list["Relationship"].push("Others");
    else{
        favorite_groupname.forEach(function(group){
            if(title.search(group) != -1) list["Relationship"].push("Favorite");
        });    
    }
    list = getGroupInfo(list, li);
    return list;
}

var friendRelationship = JSON.parse(localStorage['friends']); // {fr1, fr2, fr3...}, fr = {"name" : string, "relationship" : string, "mutual_friend_cnt" : number}
function getUserRelationship(list){
    var title = list['Title'];
    //User가 여러명일 때는 1. close_friend 2. mutual_friends가 가장 많은 친구를 대표 relationship으로 설정. 
    list["Relationship"] = [];
    var FriendsList = [];
    var IsFriend = false;
    friendRelationship.forEach(function(friend){
        if(title.search(friend["name"]) != -1){
            IsFriend = true;
            FriendsList.push(friend);
        }
    });

    if(IsFriend){ //in case of friends
        var IsClose = false;
        var Closemax = 0, Generalmax = 0;
        FriendsList.forEach(function(friend){
            if(friend["Relationship"] == "친한 친구"){
                IsClose = true;
                if(Closemax < friend["mutual_friend_cnt"]) Closemax = friend["mutual_friend_cnt"];
            }
            else{
                if(Generalmax < friend["mutual_friend_cnt"]) Generalmax = friend["mutual_friend_cnt"];
            }
        })
        if(IsClose){ //in case of close friends
            list["Relationship"].push("CloseFriend");
            list["Relationship"].push(Closemax);
        }
        else{ //in case of general friends
            list["Relationship"].push("Friend");
            list["Relationship"].push(Generalmax);
        }
    }
    else{ // in case of other users
        list["Relationship"].push("Others");    
    }

    return list;
}

function getMedia(list, li){
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
        //text 길이 추가!!
        var content = $(li).find('a').eq(0);
        $.ajax(content.attr('href'))
            .done(function(text){
                

        });
        
    }
    return list;
}

function getSCL(list, li){
    var content = $(li).find('a').eq(0);
    $.ajax(content.attr('href'))
        .done(function(text){
            var like_re = /((,|\d)*)명/; //get the number of likes
            var like_res = like_re.exec(text);
            var like_cnt;
            if(like_res == null) like_cnt = 0; 
            else like_cnt = +like_res[1].replace(/,/g,'');
            list["Like"] = like_cnt; 
            
            var comment_re = /댓글 ((,|\d)*)개/; //can not use ajax
            var comment_res = comment_re.exec(text);
            var comment_cnt;
            if(comment_res == null) comment_cnt = 0;
            else comment_cnt = +comment_res[1].replace(/,/g,'');
            list["Comment"] = comment_cnt;

            var share_re = /공유 ((,|\d)*)회/; //can not use ajax
            var share_res = share_re.exec(text);
            var share_cnt;
            if(share_res == null) share_cnt = 0;
            else share_cnt = +share_res[1].replace(/,/g,'');
            list["Share"] = share_cnt;
        })
    return list;
}

function getContentInfo(list, li, IsGroupActivity){
    var title = list['Title'];
    list = getMedia(list, li);
    //list = getSCL(list, li, IsGroupActivity); //(Share, Comment, Likes)
    return list;
};

function classifyUserActivities(list, li, IsGroupActivity){
    var title = list['Title'];
    if((title.search('게시물') != -1 && title.search('올렸습니다') != -1) || title.search('추가') != -1 || title.search('게시') != -1 || title.search('에 있습니다') != -1){ //post text
        list["Activity"] = 'Post';
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
    else if(title.search('댓글을 남겼습니다') != -1 || title.search('답글을 남겼습니다') != -1){ //Comment
        list["Activity"] = 'Comment';
        list = getContentInfo(list, li, IsGroupActivity);
    }
    else if(title.search('언급했습니다') != -1 || title.search('태그했습니다') != -1){ //tag
        list["Activity"] = 'Tag';
        list = getContentInfo(list, li, IsGroupActivity);
    }
    else if(title.search('공유') != -1){ //share
        list["Activity"] = 'Share';
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

function classifyPageAcitivites(list){
    var title = list['Title'];
    if(title.search('새 이벤트') != -1 && title.search('추가') != -1){ //add an event 
        list["Activity"].push('AddEvent');
    }
    return list;
}

function classifySystemAcitivies(list){
    var title = list['Title'];
    
    if(title.search('친구 추천') != -1){ //recommendation friends 
        list["Activity"].push('RecommendFriend');
    }
    else if(title.search('동영상') != -1 && title.search('확인') != -1){ // recommendation video
        list["Activity"].push('RecommendVideo');
    }
    else if(title.search('지역 페이지') != -1 && title.search('새로운 소식') != -1){ //recommendation local pages
        list["Activity"].push('RecommendLocalpage');
    }
    else if((title.search('알 수 있도록') != -1 && title.search('좋아요를 요청') != -1) || 
    (title.search('늘릴 수 있도록') != -1 && title.search('추가하세요') != -1)){ //recommended action for my pages 
        list["Activity"].push('RecommendationforMypage');
    }
    else if(title.search('페이지') != -1 && title.search('활동') != -1){ //notify the current page status 
        list["Activity"].push('NotifystatusofMypage');
    }
}

var lis = document.querySelectorAll('ul > li._33c');

var notifications = [];
var noti_num = 0;
var liked_pagename = JSON.parse(localStorage['liked_pagename']);
var my_pagename = JSON.parse(localStorage['my_pagename']);


lis.forEach(function(li){
    var noti_title = $(li).find('div._4l_v').find('span').eq(0).text();
    var notification = {};
    notification["Title"] = noti_title;

    //notification metadata
    notification = getNotiMetadata(notification, li);

    //notification activity and content lassification
    if(noti_title.search('그룹') != -1){ //Group
        notification['Sender'] = 'Group';
        notification = classifyGroupActivities(notification, li);
        //notification = getGroupRelationship(notification, li);
    }
    else if(noti_title.search('님이') != -1 || (noti_title.search('님 외') != -1 && noti_title.search('명이') != -1) || noti_title.search('생일') != -1){ //User
        notification['Sender'] = 'User';
        //notification = classifyUserActivities(notification, li, false);
        //notification = getUserRelationship(notification);
    }

    else{ //Page and System
        var IsPage = false;
        liked_pagename.forEach(function(name){
            if(noti_title.search(name) != -1){
                IsPage = true;
                notification['Sender'] = 'Page';
                notification['Relationship'] = 'LikedPage';
                //notification = classifyPageAcitivites(notification);
            }
        });
        my_pagename.forEach(function(name){
            if(noti_title.search(name) != -1){
                IsPage = true;
                notification['Sender'] = 'Page';
                notification['Relationship'] = 'MyPage';
                //notification = classifyPageAcitivites(notification);
            }
        });
        if(!IsPage){
            notification['Sender'] = 'System';
            //notification = classifySystemAcitivies(notification);
        }
    }
    notifications.push(notification);
});


// //get group factors (public / closed)
// var g_factor = document.querySelector('div._19s_'); //-> 이거 ajax에서 받아오는 걸로 바꿔야함
// g_factor = $(g_factor).text(); //'비공개 그룹'
// g_factor.replace(/ .*/,''); // '비공개' from '비공개 그룹'
// var Ispublic;
// if(g_factor == '비공개') Ispublic = false;
// else if(g_factor == '공개') Ispublic = true;

