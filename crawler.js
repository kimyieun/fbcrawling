function createCSV(rows) {
    var content = "data:text/csv;charset=utf-8,";
  
    rows.forEach(function(row, index) {
      content += row.join(", ") + "\n";
    });
  
    return encodeURI(content);
  }  
  

let lis = document.querySelectorAll('ul > li._33c');
lis = Array.prototype.slice.call(lis);

let row = lis.map(li => {
    let time = JSON.parse(li.dataset.gt);
    return [li.innerText.trim(), new Date(+(time.time_sent + '000'))];
})

var encodedUri = createCSV(row);

var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);

