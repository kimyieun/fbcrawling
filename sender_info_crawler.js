/*
1. ordinary friends, close friends, other user, the number of mutual friends
2. joined groups, favorite groups, other groups
3. liked pages, other pages
4. my pages
5. 
6.
7.
8.

*/

/*
1. get relationship between friends, get the number of mutual friends
**친구 리스트 모두 로딩해야함
*/
var friend_relationship = {}; // {friend's name : {relationship: 'aa', the number of mutual friends}}
var friends = document.querySelectorAll('ul > li._698');
var count = 0;

friends.forEach(function(friend){
    //relationship
    var name = $(friend).find('div.uiProfileBlockContent').find('a').eq(0).text()
    var relationship = $(friend).find('u').text();
    friend_relationship[name] = {};
    friend_relationship[name].relationship = relationship;

    //mutual friends
    
    var re = /친구 (\d*)명/;
    var content = $(friend).find('div.clearfix._5qo4').find('a._5q6s');
    $.ajax(content.attr('href'))
        .done(function(text){
            if(text != null){
                count++;
                console.log("%s %3d / %3d", name, count, friends.length);
                var res = re.exec(text);
                var mutual_friend_cnt;
                if(res == null) mutual_friend_cnt = 0;
                else mutual_friend_cnt = +res[1];
                
                friend_relationship[name].mutual_friend_cnt = mutual_friend_cnt;
            }
        })
});



/////asynchronous!
// function get_mutual_friends(name, content){
//     $.ajax({
//         type : 'GET',
//         url : content.attr('href'),
//         success : function(text){
//             if(text != null){
//                 var re = /친구 (\d*)명/;
//                 count++;
//                 console.log("%s %3d / %3d", name, count, friends.length);
//                 var res = re.exec(text);
//                 var mutual_friend_cnt;
//                 if(res == null) mutual_friend_cnt = 0;
//                 else mutual_friend_cnt = +res[1];
                
//                 friend_relationship[name].mutual_friend_cnt = mutual_friend_cnt;
//             }
//         }
//     });
// };

// friends.forEach(function(friend){
//     //relationship
//     var name = $(friend).find('div.uiProfileBlockContent').find('a').eq(0).text()
//     var relationship = $(friend).find('u').text();
//     friend_relationship[name] = {};
//     friend_relationship[name].relationship = relationship;

//     //mutual friends
//     var content = $(friend).find('div.clearfix._5qo4').find('a._5q6s');
//     get_mutual_friends(name, content);
// });

/*
2. get joined groups name (favorite / not)
https://www.facebook.com/groups/
**그룹 리스트 모두 로딩해야함
*/
function getName(items){
    return items.map(item => $(item).find('a').text());

    // function(a) { return a + 1 }
    // a => a + 1;

    // function(a, b) { return a + b;}

    // (a, b) => a + b

    // function(a, b) { var c = a + b; return c; }
    // (a, b) => { var c = a + b; return c; }
}

var favorite_group = document.querySelectorAll('#GroupDiscoverCard_favorite > div._4-u3 > ul.uiList > li > ul > li');
var ordinary_group = document.querySelectorAll('#GroupDiscoverCard_membership > div._4-u3 > ul.uiList > li > ul > li');
var favorite_groupname = getName(favorite_group);
var ordinary_groupname = [];
ordinary_groupname = getName(ordinary_group, ordinary_groupname);

/*
3. get liked pages name
https://www.facebook.com/pages/?category=liked
**페이지 리스트 모두 로딩해야함
*/
function getName(items, list){
    items.forEach(function(item){
        var name = $(item).find('a').text();
        list.push(name);
    });
    return list;
}

var liked_pages = document.querySelector('div._5tut');
liked_pages = liked_pages.querySelectorAll('div._4-u2 > div._4-u3._5l2c');
export var liked_pagename = [];
liked_pagename = getName(liked_pages, liked_pagename);

/*
4. get my pages name
https://www.facebook.com/pages/?category=your_pages
**페이지 리스트 모두 로딩해야함
*/
var my_pages = document.querySelectorAll('div._1vgt.ellipsis._349g');
export var my_pagename = [];
my_pagename = getName(my_pages, my_pagename);

