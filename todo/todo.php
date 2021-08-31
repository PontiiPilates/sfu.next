<?

//* сделаны jsonы:
//! structure
//! news

// сделать вывод структурных подразделений
// появился новый тип - department, на фронтенде с ним нужно обращаться соответствующим образом
// после написания всех выводов нужно сформировать базу данных на собственном сервере и файловое хранилище
// на фронтенде при использовании поисковика появляются артефакты
// добавить поиск информации по номеру телефона
//* сделать поиск по документам





// // сделать поиск по новостям
// // сделать поиск по объявлениям
// // сделать поиск по анонсам








// TODO:
//* добавить категории в типы поиска: department - подразделение, institute - институт
//* убрать артефакты из поиска
//* если во время введения поискового запроса нажать стрелочку вправо, то запрос заполнится, а если стрелочку влево, то запрос исчезнет вместе с введением
//* в автокомплите фио написано с маленькой буквы
//* при клике по форме запроса выпадает автокомплит с результатами предыдущего запроса даже если в данный момент автокомплит пуст
//* сделать так, чтобы можно было легко добавлять источники даты для поиска

// SOURCE:
https://about.sfu-kras.ru/get-about
https://structure.sfu-kras.ru/get-structure
https://news.sfu-kras.ru/get-news
https://www.sfu-kras.ru/get-sfu
https://admissions.sfu-kras.ru/get-admissions
https://edu.sfu-kras.ru/get-edu
https://international.sfu-kras.ru/get-international
https://tube.sfu-kras.ru/get-tube


// career
// yconfs
// photo
// research



// адрес http://next.sfu-kras.ru/modules/search/data_getter.php возвращает выборку из базы данных сразу в виде jsonа
// состав: id, source, name, description, type, link, file_img
// обрати внимание на file_img
// он есть только для данных со structure.sfu-kras.ru
// у таких данных source - structure
// file_img хранит только имя файла
// пути в базе данных не хранятся
// и их всего два: для аватарок со структуры и для иконок для всего остального
// http/modules/search/miniatures/avatars
// http/modules/search/miniatures/others
// соответственно логику для того, какую картинку где показывать я оставил на фронтенд
// получится что-то типа:
//      если sourse == structure, то modules/search/miniatures/avatars + file_img
//      если source != structure, то http/modules/search/miniatures/others + source + .png