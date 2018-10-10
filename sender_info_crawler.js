/*
1. ordinary friends, close friends, other user, the number of mutual friends
2. joined groups, favorite groups, other groups
3. liked pages, other pages
4. my pages
*/
/*
1. get relationship between friends, get the number of mutual friends
**친구 리스트 모두 로딩
*/
var friends = document.querySelectorAll('ul > li._698');
var senderlist = {};

notifications.forEach(function(noti){ //notification에 나온 sender name dictionary 생성
    if(noti['Sender'] == 'User'){
        var noti_name = (typeof(noti['SenderName']) != "string")? noti['SenderName'][0] : noti['SenderName'];
        senderlist[noti_name] = [];
    }
});

function getFriendsInfo(friend){
    var friendname = $(friend).find('div.uiProfileBlockContent').find('a').eq(0).text();
    //console.log(friendname);
    if(friendname in senderlist){
        //relationship
        var relationship = $(friend).find('u').text();
        if(relationship != "") senderlist[friendname].push(relationship);
        else senderlist[friendname].push("친구");
        //mutual_friend_cnt
        var re = /친구 ((,|\d)*)명/;
        var content = $(friend).find('div.clearfix._5qo4').find('a._5q6s');
        $.ajax(content.attr('href'))
            .done(function(text){
                if(text != null){
                    //friends_count++;
                    //console.log("%s %3d / %3d", name, friends_count, friends.length);
                    var res = re.exec(text);
                    var mutual_friend_cnt;
                    if(res == null) mutual_friend_cnt = 0;
                    else mutual_friend_cnt = +res[1];
                    senderlist[friendname].push(mutual_friend_cnt);
                }
            });
    }
}

var i = 0;
var myvar = setInterval(function() {
    console.log(i + " " + friends.length);
        if(i >= friends.length) clearInterval(myvar);
        getFriendsInfo(friends[i++]);
}, 500);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

notifications.forEach(function(noti){
    if(noti['Sender'] == 'User'){
        var noti_name = (typeof(noti['SenderName']) != "string")? noti['SenderName'][0] : noti['SenderName'];
        if(senderlist[noti_name] == []) noti['Relationship'] = ["Other"];
        else noti['Relationship'] = [senderlist[noti_name][0], senderlist[noti_name][1]];
    }
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

  downloadObjectAsJson(notifications, "9_" + "notifications+User");
/*
2. get joined groups name (favorite / not)
https://www.facebook.com/groups/
**그룹 리스트 모두 로딩
*/
function getName(items){
    return items.map(item => $(item).find('a').eq(0).text());
}

var favorite_group = document.querySelectorAll('#GroupDiscoverCard_favorite > div._4-u3 > ul.uiList > li > ul > li');
var ordinary_group = document.querySelectorAll('#GroupDiscoverCard_membership > div._4-u3 > ul.uiList > li > ul > li');

var favorite_groupname = getName(Object.values(favorite_group));
var ordinary_groupname = getName(Object.values(ordinary_group));


notifications.forEach(function(noti){
    if(noti['Sender'] == 'Group'){
        var favorite_found = Object.keys(favorite_groupname).filter(function(key){
            return favorite_groupname[key] === noti['SenderName'];
        })
        if(favorite_found.length){
            noti['Relationship'].push('Favorite');
        }
        else noti['Relationship'].push('Joined');
    }
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

  downloadObjectAsJson(notifications, "9_" + "data");


// /*
// 3. get liked pages name
// https://www.facebook.com/pages/?category=liked
// **페이지 리스트 모두 로딩
// */

// function getName(items){
//     return items.map(item => [$(item).find('a').text()]);
// }

// var liked_pages = document.querySelector('div#page_browser_liked');
// var liked_pagename = getName(Object.values(liked_pages));

// notifications.forEach(function(noti){
//     if(noti['Sender'] == 'LikedPage'){
//         var found = Object.keys(liked_pagename).filter(function(key){
//             return liked_pagename[key] === noti['SenderName'];
//         })
//         if(found.length) noti['Relationship'] = 'LikedPage';
//     }
// });

// function downloadObjectAsJson(exportObj, exportName){
//     var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
//     var downloadAnchorNode = document.createElement('a');
//     downloadAnchorNode.setAttribute("href",     dataStr);
//     downloadAnchorNode.setAttribute("download", exportName + ".json");
//     document.body.appendChild(downloadAnchorNode); // required for firefox
//     downloadAnchorNode.click();
//     downloadAnchorNode.remove();
//   }

//   downloadObjectAsJson(notifications, "notifications+LikedPage");

// /*
// 4. get my pages name
// https://www.facebook.com/pages/?category=your_pages
// **페이지 리스트 모두 로딩
// */
// function getName(items){
//     return items.map(item => $(item).find('a').text());
// }

// var my_pages = document.querySelectorAll('div._1vgt.ellipsis._349g');
// var my_pagename = getName(Object.values(my_pages));

// notifications.forEach(function(noti){
//     if(noti['Sender'] == 'Page'){
//         var found = Object.keys(my_pagename).filter(function(key){
//             return my_pagename[key] === noti['SenderName'];
//         })
//         if(found.length) noti['Relationship'] = 'LikedPage';
//     }
// });

// function downloadObjectAsJson(exportObj, exportName){
//     var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
//     var downloadAnchorNode = document.createElement('a');
//     downloadAnchorNode.setAttribute("href",     dataStr);
//     downloadAnchorNode.setAttribute("download", exportName + ".json");
//     document.body.appendChild(downloadAnchorNode); // required for firefox
//     downloadAnchorNode.click();
//     downloadAnchorNode.remove();
//   }

//   downloadObjectAsJson(notifications, "notifications+MyPage");
