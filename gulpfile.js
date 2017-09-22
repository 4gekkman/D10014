/*------------------------------------------//
//                                          //
//          GulpFile.js DLW-пакета					//
//                                          //
//------------------------------------------//
//	Оглавление  //
//--------------//

	1. Подключить необходимые NPM-пакеты
	2. Создать файл с датой последнего исполнения рядом с gulpfile.js
	3. Получить необходимые данные от suf_watch_setting
		3.1. Получить массив путей к каталогам и файлам с фронтенд-исходниками
		3.2. Получить массив путей к каталогам и файлам с фронтенд-результатами
	4. Создать набор задач "styles"_<номер> для обработки стилей
	5. Создать набор задач "javascript"_<номер> для обработки js-скриптов
	6. Создать набор задач "assets"_<номер> для обработки assets
	7. Сформировать задачу run для запуска всех i-ых задач

	x. Функционал для инкрементальной вёрстки с realtime-обновлением документа
	n. Примеры часто используемых задач

		▪ Обработать SCSS-исходники
		▪ Скопировать всё из assets в public
		▪ Параллельно выполнить задачи styles и assets

//------------------------------------------//
//	Код  //
//-------*/

// 1. Подключить необходимые NPM-пакеты
'use strict';
const gulp = require('gulp');
const sass = require('../R5/node_modules/gulp-sass');
const file = require('../R5/node_modules/gulp-file');
const cssnano = require('../R5/node_modules/gulp-cssnano');
const uglify = require('../R5/node_modules/gulp-uglify');
const concat = require('../R5/node_modules/gulp-concat');
const fs = require('fs');
const autoprefixer = require('../R5/node_modules/gulp-autoprefixer');
const sourcemaps = require('../R5/node_modules/gulp-sourcemaps');
const browserSync = require('../R5/node_modules/browser-sync').create();

// 2. Создать файл с датой последнего исполнения рядом с gulpfile.js
gulp.task('lastuse', function(callback) {

	fs.writeFile("lastuse", "Дата и время (UTC) последнего выполнения gulp-задачи для этого DLW-пакета.\n"+new Date().toUTCString());
  callback();

});

// 3. Получить необходимые данные от suf_watch_setting

	// 3.1. Получить массив путей к каталогам и файлам с фронтенд-исходниками
	// - Для этого D-пакета, а также всех LW-пакетов, от которых он зависит
	var sources = [];
	sources['styles'] = [];
	sources['javascript'] = [];
	sources['assets'] = [];

		// sources: start
    sources["styles"] = [
      "../L10001/Public/css/**/*.*", 
      "../D10014/Public/css/**/*.*", 
    ];
    sources["javascript"] = [
      "../L10001/Public/js/", 
      "../D10014/Public/js/", 
    ];
    sources["assets"] = [
      "../L10001/Public/assets/**/*.*", 
      "../D10014/Public/assets/**/*.*", 
    ];
    // sources: end

	// 3.2. Получить массив путей к каталогам и файлам с фронтенд-результатами
	// - Для этого D-пакета, а также всех LW-пакетов, от которых он зависит
	var dests = [];
	dests['styles'] = [];
	dests['javascript'] = [];
	dests['assets'] = [];
	dests['php'] = [];

		// dests: start
    dests["styles"] = [
      "../../../public/public/L10001/css", 
      "../../../public/public/D10014/css", 
    ];
    dests["javascript"] = [
      "../../../public/public/L10001/js", 
      "../../../public/public/D10014/js", 
    ];
    dests["assets"] = [
      "../../../public/public/L10001/assets", 
      "../../../public/public/D10014/assets", 
    ];
    dests["php"] = [
      "../L10001/**/*.php", 
      "../D10014/**/*.php", 
    ];
    // dests: end

// 4. Создать набор задач "styles"_<номер> для обработки стилей
for(var stylesnum=0; stylesnum<sources["styles"].length; stylesnum++) {

	// Создать i-ую задачу
	module.exports['styles_'+stylesnum] = function(stylesnum, callback){

		return gulp.src(sources["styles"][stylesnum])
				.pipe(sourcemaps.init())
				.pipe(sass())
				.pipe(autoprefixer())
				.pipe(cssnano())
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(dests["styles"][stylesnum]));

	};

}

// 5. Создать набор задач "javascript"_<номер> для обработки js-скриптов
for(var javascriptnum=0; javascriptnum<sources["javascript"].length; javascriptnum++) {

	// Создать i-ую задачу
	module.exports['javascript_'+javascriptnum] = function(javascriptnum, callback){

		return gulp.src([sources["javascript"][javascriptnum]+'m.js', sources["javascript"][javascriptnum]+'f.js', sources["javascript"][javascriptnum]+'j.js'])
				.pipe(sourcemaps.init())
				.pipe(concat('j.js'))
				.pipe(uglify())
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(dests["javascript"][javascriptnum]));

	};

}

// 6. Создать набор задач "assets"_<номер> для обработки assets
for(var assetsnum=0; assetsnum<sources["assets"].length; assetsnum++) {

	// Создать i-ую задачу
	module.exports['assets_'+assetsnum] = function(assetsnum, callback){

		return gulp.src(sources["assets"][assetsnum], {since: gulp.lastRun('assets_'+assetsnum)})
				.pipe(gulp.dest(dests["assets"][assetsnum]));

	};

}

// 7. Сформировать задачу run для запуска всех i-ых задач

	// 7.1. Сформировать массив со списком задач
	var runtasks = ['lastuse'];
	for(var i=0; i<sources['styles'].length; i++) {
		runtasks.push(function(callback){ return module.exports['styles_'+this.index](this.index, callback); }.bind({"index": i}));
		runtasks.push(function(callback){ return module.exports['javascript_'+this.index](this.index, callback); }.bind({"index": i}));
		runtasks.push(function(callback){ return module.exports['assets_'+this.index](this.index, callback); }.bind({"index": i}));
	}

	// 7.2. Сформировать задачу run
	gulp.task('run', gulp.parallel(runtasks));

// x. Функционал для инкрементальной вёрстки с realtime-обновлением документа

	// x.1. Следить за файлами в sources, запускать задачу при их изменении
	gulp.task('watch', function(){

		// styles
		for(var i=0; i<sources['styles'].length; i++) {
			gulp.watch(sources['styles'][i], {usePolling: false}, function(callback){ return module.exports['styles_'+this.index](this.index, callback); }.bind({"index": i}));
		}

		// javascript
		for(var i=0; i<sources['javascript'].length; i++) {
			gulp.watch(sources['javascript'][i], {usePolling: false}, function(callback){ return module.exports['javascript_'+this.index](this.index, callback); }.bind({"index": i}));
		}

		// assets
		for(var i=0; i<sources['assets'].length; i++) {
			gulp.watch(sources['assets'][i], {usePolling: false}, function(callback){ return module.exports['assets_'+this.index](this.index, callback); }.bind({"index": i}));
		}

	});

	// x.2. Настройка browser-sync
	// - Запустить мини-сервер для отладки blade-документа этого D-пакета (либо можно использовать прокси)
	// - Следить за файлами в dests, перезагружать документ при их изменении
	gulp.task('serve', function(){

		// x.2.1] Запустить proxy
		browserSync.init({
			proxy: "localhost",
			ws: true
		});

		// x.2.2] Отслеживать изменения в указанных файлах

			// styles
			for(var i=0; i<dests['styles'].length; i++) {
				browserSync.watch(dests['styles'][i], {usePolling: false}).on('change', browserSync.reload);
			}

			// javascript
			for(var i=0; i<dests['javascript'].length; i++) {
				browserSync.watch(dests['javascript'][i], {usePolling: false}).on('change', browserSync.reload);
			}

			// assets
			for(var i=0; i<dests['assets'].length; i++) {
				browserSync.watch(dests['assets'][i], {usePolling: false}).on('change', browserSync.reload);
			}

			// php
			for(var i=0; i<dests['php'].length; i++) {
				browserSync.watch(dests['php'][i], {usePolling: false}).on('change', browserSync.reload);
			}

	});

	// x.3. Задача для запуска watch и serve параллельно
	gulp.task('dev',
			gulp.series('run', gulp.parallel('watch', 'serve')));



// n. Примеры часто используемых задач


	// Обработать SCSS-исходники
	// gulp.task('styles', function(callback){

	// 	// Найти и обработать .scss файлы, записать в public
	// 	return gulp.src('frontend/styles/main.scss')
	// 			.pipe(sourcemaps.init())
	// 			.pipe(sass())
	// 			.pipe(sourcemaps.write())
	// 			.pipe(gulp.dest('public'));

	// 	// Сигнализировать о завершении задачи
	// 	//callback();

	// });


	// Скопировать всё из assets в public
	// gulp.task('assets', function(){
	// 	return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
	// 			.pipe(gulp.dest('public'));
	// });


	// Параллельно выполнить задачи styles и assets
	// gulp.task('build', gulp.series(
	// 	gulp.parallel('styles', 'assets')
	// ));


