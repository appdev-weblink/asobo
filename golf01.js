<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>GOLF Gear</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
	<script type="text/javascript" src="golf01.js"></script>
	<link href="golf01.css" rel="stylesheet" type="text/css" />
</head>

<body>
	<!-- header -->
	<div id="header">
		<a href="#" class="headA" onclick="reloadPosition();">霞ヶ浦CC</a>
  </div>
	<!-- course map -->
  <div id="svg_base"></div>
	<!-- footer -->
	<div id="footer">
		<p>位置取得</p>
	</div>
	<!-- view course map -->
  <script>
  	viewCourse();
  </script>
</body>
</html>
