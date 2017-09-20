const SVG = 'http://www.w3.org/2000/svg';
var svg;
// jsonデータ
var base; // base
var parts; // contents
// 自分の位置
var myPos;
var myPosFlg = false;
var xRate, yRate; // 伸縮率
var xBase, yBase; // 起点
// viewport
var vHeight = 500;
var vWidth = 375;


// ===== 伸縮率計算 =====
function getViewRate () {
	// 1秒あたりのpx数:y軸
	yRate = vHeight / Math.abs(base.min.lat - base.max.lat) / 100000;
	// 1秒あたりのpx数:x軸
	xRate = yRate * ( base.scale.lonrate / base.scale.latrate);
	// 起点:x軸
	xBase = (Math.abs(base.min.lon + base.max.lon) / 2) - (((vWidth / 2) * yRate) / 100000);
	// 起点:y軸
	yBase = base.min.lat;
}

// 2点間の距離を求める:小数点以下四捨五入
var getDistance = function(pos1, pos2) {
	// 経度の距離yard数
	var x = (pos1.lon - pos2.lon) * base.scale.lonrate;
	// 緯度の距離yard数
	var y = (pos1.lat - pos2.lat) * base.scale.latrate;
	// 2点間の距離yard数
	var yard = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
	return yard;
};

// ===== 表示座標取得 =====
//var getPos = function (svg, point) {
var getPos = function (point) {
	var pRate = 100000;
	// 画面上の座標設定
	var x = Math.abs(point.lon - xBase) * 100000 * xRate;
	var y = Math.abs(point.lat - yBase) * 100000 * yRate;
	// テキスト用座標設定
	var p = svg.createSVGPoint();
	p.x = x;
	p.y = y;
	return p;
}

// ===== jsonファイルデータ取得関数 =====
function getJson(jsonFile) {
  // jsonデータを取得に変数に格納
  var res = $.ajax({
    type: "get", // HTTPメソッドとしてGETを用いる
    url: jsonFile, // アクセスするURL
    async: false // 同期処理する
  }).responseText;
  // json型データに変換
  return JSON.parse(res);
}

// ===== ポリゴン描画関数 =====
//function viewPolygon(svg, points, setColor) {
function viewPolygon(points, setColor) {
	// ポリゴンオブジェクトを生成
	var polygon = document.createElementNS(SVG,'polygon');
	// 線
	polygon.setAttribute("stroke", "grey");
	// 塗りつぶし
	polygon.setAttribute("fill", setColor);
	// 追加:ポリゴン
	svg.appendChild(polygon);
	// 線オブジェクトを追加
	points.forEach(function(pos){
		// 表示用座標設定
//		var p = getPos(svg, pos);
		var p = getPos(pos);
		// 追加：ポイント
		polygon.points.appendItem(p);
	});
}

// ===== 木表示 =====
//function viewTree(svg, point, setColor) {
function viewTree(point, setColor) {
	// 表示パーツ生成
	var g = document.createElementNS(SVG, 'g');
	// 表示用座標設定
//	var p = getPos(svg, point);
	var p = getPos(point);
	// ----- 円を表示 -----
	addCircle(g, p, "4", "green");
	// 表示パーツ追加
	svg.appendChild(g);
}

// ===== 距離表示:新規作成 =====
//function viewDistance(svg, point, name, color) {
function viewDistance(point, name, color) {
	// 表示パーツ生成
	var g = document.createElementNS(SVG, 'g');
	// 表示用座標設定
//	var p = getPos(svg, point);
	var p = getPos(point);
	// ----- 円を表示 -----
	addCircle(g, p, "2", color);
	// 距離取得
	var dist = getDistance(point, myPos);
	// ----- 距離を表示 -----
	addText(g, p, dist, name);
	// 表示パーツ追加
	svg.appendChild(g);
}

// ===== 距離表示:変更 =====
function changeDistance(point, name) {
	// 対象オブジェクト設定
	var elem = document.getElementById(name);
	// 距離取得
	var dist = getDistance(point, myPos);
	// 距離変更
	elem.textContent = dist;
}

// ===== 円を表示 =====
function addCircle(g, pos, r, color) {
	// 円生成
	var circle = document.createElementNS(SVG, 'circle');
	// 円属性セット
	circle.setAttribute('cx', pos.x);
	circle.setAttribute('cy', pos.y);
	circle.setAttribute('r', r);
	circle.setAttribute("fill", color);
	// 円追加
	g.appendChild(circle);
}

// ===== 距離を表示 =====
function addText(g, pos, text, name) {
	// ラベル生成
	var label = document.createElementNS(SVG,'text');
	// id設定
	label.setAttribute('id', name);
	// ラベル属性セット
	label.setAttribute('x', pos.x);
	label.setAttribute('y', pos.y + 10);
	label.setAttribute('font-family', "sans-serif");
	label.setAttribute('font-size', "10px");
	label.setAttribute('fill', "#333");
	label.textContent = text;
	// ラベル追加
	g.appendChild(label);
}

// ===== 自分の位置を取得し距離を再表示 =====
function reloadPosition() {
	//　自分の位置座標を取得
	myPos = {
		"lat": 36.140967,
		"lon": 140.435815
	};
	parts.forEach(function(part){
		// 種別によって表示処理を選択
		if (part.type == "dist") {
			changeDistance(part.points, part.name);
		}
	});
	setMyPosition();
};

function setMyPosition() {
	// 
	if (myPosFlg) {
		// 位置変更
//		changeDistance(myPos, "me");
	} else {
		// 表示パーツ生成
		var g = document.createElementNS(SVG, 'g');
		var p = getPos(myPos);
		// 円生成
		var circle = document.createElementNS(SVG, 'circle');
		// 円属性セット
		circle.setAttribute('cx', p.x);
		circle.setAttribute('cy', p.y);
		circle.setAttribute('r', "4");
		circle.setAttribute('fill', "white");
		circle.setAttribute('stroke', "blue");
		circle.setAttribute('id', "me");
		// 円追加
		g.appendChild(circle);
		// 表示パーツ追加
		svg.appendChild(g);
		// 存在フラグ変更:false>true
		myPosFlg = true;
	}
}

// ===== view course map =====
function viewCourse() {
	// ポリゴン用ポイントjson取得
  var json = getJson("golf01.json");
  base = json.base;
  parts = json.contents;
	// TEEの位置取得
	myPos = json.base.tee;
	// 変換データ各種セット
	getViewRate();
	
	// svg表示領域を取得
	var root = document.getElementById('svg_base');
	// svg要素を作る
//	var svg = document.createElementNS(SVG,'svg');
	svg = document.createElementNS(SVG,'svg');
	svg.setAttribute('width', vWidth);
	svg.setAttribute('height', vHeight);
	svg.setAttribute('id', "map");

	// ポリゴンオブジェクトを描画
	parts.forEach(function(part){
		// 種別によって表示処理を選択
		switch(part.type) {
			case "polygon": // polygon
//				viewPolygon(svg, part.points, part.color);
				viewPolygon(part.points, part.color);
				break;
			case "tree": // circle (tree)
//				viewTree(svg, part.points, part.color);
				viewTree(part.points, part.color);
				break;
			case "dist": // distance
//				viewDistance(svg, part.points, part.name, part.color);
				viewDistance(part.points, part.name, part.color);
				break;
		}
	});

	// 図形の回転
// 	polygon.setAttribute('transform', 'rotate(-100, 200, 270)');

	// 追加:SVG
	root.appendChild(svg);
}
