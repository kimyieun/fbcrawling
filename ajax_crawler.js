import {liked_pagename, my_pagename} from "./sender_info_crawler.js";

function classify_group_features(list, title){
    if(title.search('게시물') != -1 && title.search('올렸습니다') != -1){ //post
        list["Activity"].push('Post');
        list["Activity"].push('Text');
    }
    else if(title.search('사진') != -1 && title.search('추가하였습니다') != -1){ //post
        list["Activity"].push('Post');
        list["Activity"].push('Photo');
        var reg = /(\d*)장/;
        var photo_cnt = +reg.exec(title)[1];
        list["Activity"].push(photo_cnt);
    }
    return list;
};

function classify_likedpage_features(list, title){

    
};



var lis = document.querySelectorAll('ul > li._33c');

var notifications = []; //{noti_title : [read? (read : true, unread : false) , arrival time]};
var noti_num = 0;
lis.forEach(function(li){
    var noti_title = $(li).find('div._4l_v').find('span').eq(0).text();
    var notification = {};
    notification["Title"] = noti_title;
    //notification classification
    if(noti_title.search('그룹') != -1){ //group
        notification["Activity"] = ['Group'];
        notification = classify_group_features(notification, noti_title);
    }
    else{
        var isLikedPage = false;
        var isMyPage = false;
        liked_pagename.map(function(page){
            if(noti_title.search(page) != -1) isLikedPage = true;
        });

        my_pagename.map(function(page){
            if(noti_title.search(page) != -1) isMyPage = true;
        });

        if(isLikedPage){
            notification["Activity"] = ['LikedPage'];
            notification = classify_likedpage_features(notification, noti_title);
        }
        if(isMyPage){
            notification["Activity"] = ['MyPage'];
            notification = classify_mypage_features(notification, noti_title);
        }
    }



    //get the metadata of a notification
    //1. read / unread
    noti_status = $(li).find('ul._55mc').find('div._55m9').attr('aria-label');
    if(noti_status == '읽지 않은 상태로 표시') notification["Isread"] = false;
    else notification["Isread"] = true;

    //2. arrival time
    noti_arrivalTime = $(li).find('div._42ef').find('abbr').attr('data-utime');
    noti_arrivalTime = new Date(+(noti_arrivalTime + '000'));
    currentTime = new Date();
    var timeDiff = Math.abs(noti_arrivalTime.getTime() - currentTime.getTime()) / 1000; // seconds
    notification["Timediff"] = timeDiff;
    
    notifications.push(notification);
});


lis.forEach(function(notification){
    content = $(notification).find('a').eq(0);
    $.ajax({
        type : 'GET',
        url : content.attr('href'),
        success : function(text){
            q = text
        }
    });
    
    var re = /((,|\d)*)명/; //get the number of likes
    var likes_cnt = +re.exec(q)[1].replace(/,/g,'');    
});


//get a sender name
lis.forEach(function(d){
    var noti_title = $(d).find('div._4l_v').text(); //앞부분만 잘라야할 수도..
    var re = /(\D*)님/g;
    var names = re.exec(noti_title)[1];
    if(names.includes('님, ')) names = names.split('님, ');        
    findrelationship(names);
});

function findrelationship(names){
    if(typeof(names) == "string") names = [names];    
    names.forEach(function(name){
        if(name in friend_relationship){ 
            console.log(friend_relationship[name]);
        }
        else console.log('not friend');
    });
};


//get group factors (public / closed)
var g_factor = document.querySelector('div._19s_'); //-> 이거 ajax에서 받아오는 걸로 바꿔야함
g_factor = $(g_factor).text(); //'비공개 그룹'
g_factor.replace(/ .*/,''); // '비공개' from '비공개 그룹'
var Ispublic;
if(g_factor == '비공개') Ispublic = false;
else if(g_factor == '공개') Ispublic = true;

