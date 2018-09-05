/*
1. ordinary friends, close friends, other user, the number of mutual friends
2. joined groups, favorite groups, other groups
3. liked pages, other pages
4. my pages
*/


/*
1. get relationship between friends, get the number of mutual friends
**친구 리스트 모두 로딩해야함
*/
var friendsRelationship = []; // {fr1, fr2, fr3...}, fr = {"name" : string, "relationship" : string, "mutual_friend_cnt" : number}
var friends = document.querySelectorAll('ul > li._698');
var friends_count = 0;

function make_friends_relationship(friend){
    var name = $(friend).find('div.uiProfileBlockContent').find('a').eq(0).text()
    var friend_relationship = {};
    var relationship = $(friend).find('u').text();
    friend_relationship["name"] = name;
    friend_relationship["relationship"] = relationship;

    //mutual friends
    var re = /친구 ((,|\d)*)명/;
    var content = $(friend).find('div.clearfix._5qo4').find('a._5q6s');
    $.ajax(content.attr('href'))
        .done(function(text){
            if(text != null){
                friends_count++;
                console.log("%s %3d / %3d", name, friends_count, friends.length);
                var res = re.exec(text);
                console.log(name, res);
                var mutual_friend_cnt;
                if(res == null) mutual_friend_cnt = 0;
                else mutual_friend_cnt = +res[1];
                
                friend_relationship["mutual_friend_cnt"] = mutual_friend_cnt;
            }
        })
    friendsRelationship.push(friend_relationship);
};
var i = 0;
var myvar = setTimeout(function() {
        if(i >= friends.length) clearTimeout(myvar);
        make_friends_relationship(friends[i++])
}, 5000);

localStorage.setItem('friends', JSON.stringify(friendsRelationship));
friendRelationship = JSON.parse(localStorage['friends']);

/*
2. get joined groups name (favorite / not)
https://www.facebook.com/groups/
**그룹 리스트 모두 로딩해야함
*/
function getName(items){
    return items.map(item => $(item).find('a').text());
}

var favorite_group = document.querySelectorAll('#GroupDiscoverCard_favorite > div._4-u3 > ul.uiList > li > ul > li');
var ordinary_group = document.querySelectorAll('#GroupDiscoverCard_membership > div._4-u3 > ul.uiList > li > ul > li');

var favorite_groupname = getName(Object.values(favorite_group));
localStorage.setItem('favorite_groupname', JSON.stringify(favorite_groupname));
favorite_groupname = JSON.parse(localStorage['favorite_groupname']);

var ordinary_groupname = getName(Object.values(ordinary_group));
localStorage.setItem('ordinary_groupname', JSON.stringify(ordinary_groupname));
ordinary_groupname = JSON.parse(localStorage['ordinary_groupname']);

/*
3. get liked pages name
https://www.facebook.com/pages/?category=liked
**페이지 리스트 모두 로딩해야함
*/
function getName(items){
    return items.map(item => $(item).find('a').text());
}

var liked_pages = document.querySelector('div#page_browser_liked');
liked_pages = liked_pages.querySelectorAll('div._4-u2 > div._4-u3._5l2c');
var liked_pagename = getName(Object.values(liked_pages));
localStorage.setItem('liked_pagename', JSON.stringify(liked_pagename));
liked_pagename = JSON.parse(localStorage['liked_pagename']);

/*
4. get my pages name
https://www.facebook.com/pages/?category=your_pages
**페이지 리스트 모두 로딩해야함
*/
function getName(items){
    return items.map(item => $(item).find('a').text());
}

var my_pages = document.querySelectorAll('div._1vgt.ellipsis._349g');
var my_pagename = getName(Object.values(my_pages));
localStorage.setItem('my_pagename', JSON.stringify(my_pagename));
my_pagename = JSON.parse(localStorage['my_pagename']);

