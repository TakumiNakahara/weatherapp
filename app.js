class easyHttp {
  get(url, callback){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url , true);
    xhr.onload = function() {
      if(this.status === 200) {
        const response = this.response;
        callback(response);
      } else {
        alert("地域が取得できませんでした");
      }
    };
    xhr.send();
  };
}

var getAPI = new easyHttp();
document.getElementById('get-wether').addEventListener('click',(e)=>{
  var zipcode = document.getElementById('zipcode').value;
  var a = zipcode.slice(0, 3)
  var b = '-'
  var c = zipcode.slice(3)
  var postcode = a + b + c;
  if(zipcode === "") {
    alert('郵便番号を入力してください');
  } else if(zipcode.length !== 7){
    alert('正しく郵便番号が入っているか確認してください。-(ハイフン)は入力しないでください');
  } else {
    // 天気予報を取得したい地域を特定する
    getAPI.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`, function(item){
      // 初期化
      var target = document.getElementById('place');
      target.innerHTML= '';
      //APIから値を取得
      var place =  JSON.parse(item);
      var prefecture = place.results[0].address1;
      var city = place.results[0].address2;
      var place = place.results[0].address3;
      // DOM操作
      var append = document.createElement('h3');
      append.classList.add('place-name');
      append.innerHTML = `${prefecture}${city}${place}の天気予報です。`;
      target.appendChild(append);
    });

    // 天気を取得する
    getAPI.get(`http://api.openweathermap.org/data/2.5/forecast?zip=${postcode},JP&units=metric&lang=ja&APPID=1c86a8833705e2b5db3006dd552b41ba`, function(item){
      // 初期化
      var itemWrap = document.getElementById('weather');
          itemWrap.innerHTML='';
      //APIから値を取得
      var place =  JSON.parse(item);
      var placeList = place.list;
      placeList.forEach((item) => {
        var time = item.dt_txt;
        var desc = item.weather[0].description;
        var icon = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        var humid = item.main.humidity;
        // DOM操作
        var item = document.createElement('tr');
        item.classList.add('getWeather');
        item.innerHTML = `<td>${time}</td>
        <td>${humid}%</td>
        <td>${desc}</td>
        <td><img src="${icon}"></td>`;
        itemWrap.appendChild(item);
      });
    });
  }
  e.preventDefault();
});