var lis = document.querySelectorAll('ul[data-testid="see_all_list"] > li');
//var odd_notis = [];
//var even_notis = [];
var notis = [];
var noti_num = 0;

lis = Object.keys(lis).map(function(key){
    return lis[key];
});

lis.some(function (li) {
    noti = li.outerHTML;
    try {
        notis.push(noti);
        //if(noti_num % 2 == 0) even_notis.push(noti);
        //else odd_notis.push(noti); 
        noti_num++;
        if(noti_num >= 50) return true;
        else return false;
    } catch (e) {
        console.log(e);
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
  downloadObjectAsJson(notis, "noti");