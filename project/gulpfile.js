var gulp = require('gulp');

	sass         = require('gulp-sass'), //Подключаем Sass пакет,
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
 
gulp.task('sass', function() { // Создаем таск Sass
	return gulp.src('src/sass/**/*.sass') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('src/css')) // Выгружаем результата в папку src/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});
 
gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'src' // Директория для сервера - src
		},
		notify: false // Отключаем уведомления
	});
});
 
gulp.task('code', function() {
	return gulp.src('src/*.html')
	.pipe(browserSync.reload({ stream: true }))
});
 
gulp.task('clean', async function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});
 
gulp.task('img', function() {
	return gulp.src('src/img/**/*') // Берем все изображения из src
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});
 
gulp.task('prebuild', async function() {
 
	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'src/css/styles.css',
		])
	.pipe(gulp.dest('dist/css'))
 
	var buildFonts = gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))
 
	var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))
 
	var buildHtml = gulp.src('src/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));
 
});
 
gulp.task('clear', function (callback) {
	return cache.clearAll();
})
 
gulp.task('watch', function() {
	gulp.watch('src/sass/**/*.sass', gulp.parallel('sass')); // Наблюдение за sass файлами
	gulp.watch('src/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
	gulp.watch(['src/js/index.js', 'src/libs/**/*.js']); // Наблюдение за главным JS файлом и за библиотеками
});
gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean'));