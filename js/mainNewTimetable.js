function delCharSTR(oldStr){
	// return oldStr.replace(new RegExp(' ','gi'), '').replace(new RegExp('-','gi'), '').replace(new RegExp('\/','gi'), '').replace(new RegExp('(','gi'), '').replace(new RegExp(')','gi'), '').replace(new RegExp('.','gi'), '').replace(new RegExp(',','gi'), '').replace("0", '');
	return oldStr.replace(new RegExp(' ','gi'), '').replace(new RegExp('-','gi'), '').replace(new RegExp('\/','gi'), '').replace('(', '').replace(')', '').replace(".", '').replace(",", '').replace("0", '');
}
function delCharReg(oldStr){
	return oldStr.replace(' ', '').replace('-', '').replace("/", '').replace("(", '').replace(")", '').replace(".", '').replace(",", '').replace("0", '');
}
$(document).ready(function(){

	// amplitude.getInstance().logEvent('Начало сеанса');

	let BASE_API_URL = '//edu.sfu-kras.ru/api/timetable/get&target=';
	var IS_TIMETABLE_LOADED = false;
	var getSubTodayNewInterval;
	var slowConnectionCounter;
	var hasUserGroup;
	var statusCode;
	var isLoadedGroups;
	var isLoadedTeachers;
	const anim_time = 150;
	const defaultStatus = "Можно писать без дефисов, пробелов и точек";

	let insts = {
		'Институт архитектуры и дизайна' : 'ИАД',
		'Институт фундаментальной биологии и биотехнологии' : 'ИФББ',
		'Институт космических и информационных технологий' : 'ИКИТ',
		'Институт торговли и сферы услуг' : 'ИТиСУ',
		'Институт Севера и Арктики' : 'ИСиА',
		// 'Торгово-экономический институт' : 'ТЭИ',
		'Военный учебный центр' : 'ВУЦ',
		'Военно-инженерный институт' : 'ВИИ',
		'Институт филологии и языковой коммуникации' : 'ИФиЯК',
		// 'Институт экономики, управления и природопользования' : 'ИЭУП',
		'Институт экономики, государственного управления и финансов' : 'ИЭГУиФ',
		'Институт нефти и газа' : 'ИНГ',
		'Институт горного дела, геологии и геотехнологий' : 'ИГДГиГ',
		'Гуманитарный институт' : 'ГИ',
		'Инженерно-строительный институт' : 'ИСИ',
		'Институт математики и фундаментальной информатики' : 'ИМФИ',
		'Политехнический институт' : 'ПИ',
		'Институт управления бизнес-процессами' : 'ИУБП',
		// 'Институт управления бизнес-процессами и экономики' : 'ИУБПЭ',
		'Институт инженерной физики и радиоэлектроники' : 'ИИФиРЭ',
		'Институт физической культуры, спорта и туризма' : 'ИФКСТ',
		'Институт педагогики, психологии и социологии' : 'ИППС',
		'Институт цветных металлов и материаловедения' : 'ИЦММ',
		'Институт экологии и географии' : 'ИЭГ',
		'Институт гастрономии' : 'ИГ',
		'Юридический институт' : 'ЮИ'
	}
	let subject_nums = {
		'08:30-10:05' : '1',
		'10:15-11:50' : '2',
		'12:00-13:35' : '3',
		'14:10-15:45' : '4',
		'15:55-17:30' : '5',
		'17:40-19:15' : '6',
		'19:25-21:00' : '7',
		'21:10-22:40' : '8'
	}
	let months = {
		'0' : 'января',
		'1' : 'февраля',
		'2' : 'марта',
		'3' : 'апреля',
		'4' : 'мая',
		'5' : 'июня',
		'6' : 'июля',
		'7' : 'августа',
		'8' : 'сентября',
		'9' : 'октября',
		'10' : 'ноября',
		'11' : 'декабря'
	}

	let suggestion = $('.suggestion');
	let suggest = $('.suggest');
	let suggestion_active = false;

	let main_input = $('.search-input');
	let search_block = $('.search-block');

	// переход по истории
	window.addEventListener ("popstate", function (e) {
		
		console.log(e.state);
		main_input.val(e.state.name);
		let inst = 'undefined';
		for (let index = 0; index < groups.length; index++) {
			if (e.state.name == groups[index].name){
				inst = groups[index].institute;
				// localStorage.setItem('inst', inst);
			}
		}
		console.log(inst);
		amplitude.getInstance().logEvent('Назад по браузеру', {'group' : e.state.name});
		anime({
			targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
			// targets: ['.information', '.contact'],
			duration: anim_time, 
			opacity: 0,
			// scale: 0.99,
			easing: 'easeInOutQuad',
			complete: function(){

				$('.search-icon-load').removeClass('none');
				$('.search-icon-search').addClass('none');
				// $('.preloader').removeClass('preloader_invis');
				// window.history.pushState({'name' : e.state.name}, null, null);

				makeTimetable(function(){
					setInformation(inst);
					showResult();
					// getSubToday();
					getSubTodayNew();
					IS_TIMETABLE_LOADED = true;
					// amplitude.getInstance().logEvent('Назад по браузеру - успешно', {'group' : e.state.name});
					// console.log(IS_TIMETABLE_LOADED);

					// $('.preloader').addClass('preloader_invis');
					$('.contact').addClass('contact_visible');
					$('.search-icon-load').addClass('none');
					$('.search-icon-search').removeClass('none');
				});
			}
		});
		localStorage.setItem('group', e.state.name);
	});

	if (localStorage.getItem('group') != undefined){
		$('.search-icon-load').removeClass('none');
		$('.search-icon-search').addClass('none');
		hasUserGroup = true;
		// isSlowConnection();
		window.history.pushState({'name' : localStorage.getItem('group')}, null, null);
		repaint();
	}
	else{
		hasUserGroup = false;
		// $('.preloader').addClass('preloader_invis');
		$('.search-icon-load').addClass('none');
		$('.search-icon-search').removeClass('none');
	}

	var groups = []
	// amplitude.getInstance().logEvent('Прогрузка групп');
	$.getJSON('//edu.sfu-kras.ru/api/timetable/groups', true, function(data){
		isLoadedGroups = true;
		$.each(data, function(key, value){
			groups.push(value);
		});
		// console.log(groups);
		// amplitude.getInstance().logEvent('Прогрузка групп - успешно');
	}).fail(function(data, textStatus, xhr){
		if (!hasUserGroup){
			console.log('Ошибка: ' + data + ' ' + textStatus + ' ' + xhr);
			connectionError(1, 'Проблемы с интернетом. Попробуйте переподключиться или перезагрузить страницу');
			isLoadedGroups = false;
			$('.button-reconnect').removeClass('none');
			amplitude.getInstance().logEvent('Прогрузка групп - ошибка');
		}
	});;

	// amplitude.getInstance().logEvent('Прогрузка преподов');
	$.getJSON('//edu.sfu-kras.ru/api/timetable/teachers', true, function(data){
		$.each(data, function(key, value){
			isLoadedTeachers = true;
			groups.push(value);
		});
		// amplitude.getInstance().logEvent('Прогрузка преподов - успешно');
	}).fail(function(data, textStatus, xhr){
		if (!hasUserGroup){
			console.log('Ошибка: ' + data + ' ' + textStatus + ' ' + xhr);
			connectionError(1, 'Проблемы с интернетом. Попробуйте переподключиться или перезагрузить страницу');
			isLoadedTeachers = false;
			$('.button-reconnect').removeClass('none');
			amplitude.getInstance().logEvent('Прогрузка преподов - ошибка');
		}
	});

	// groups = groups.reverse();

	function SBClick(subgroup, i, inst, IS_TIMETABLE_LOADED, main_input){
		$('.subgroup_name_new').eq(i).click(function(){
			// console.log('Вызов');
			// console.log(subgroup);
			ym(56325538,'reachGoal','changeSubgroup');
			main_input.val(subgroup);
			amplitude.getInstance().logEvent('Смена подгруппы', {'group' : subgroup});
			anime({
				targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
				// targets: ['.information', '.contact'],
				duration: anim_time, 
				opacity: 0,
				// scale: 0.99,
				easing: 'easeInOutQuad',
				complete: function(){

					// $('.preloader').removeClass('preloader_invis');
					$('.search-icon-load').removeClass('none');
					$('.search-icon-search').addClass('none');
					window.history.pushState({'name' : subgroup}, null, null);

					makeTimetable(function(){
						setInformation(inst);
						showResult();
						// getSubToday();
						getSubTodayNew();
						IS_TIMETABLE_LOADED = true;
						// amplitude.getInstance().logEvent('Смена подгруппы - успешно', {'group' : subgroup});
						// console.log(IS_TIMETABLE_LOADED);

						// $('.preloader').addClass('preloader_invis');
						$('.contact').addClass('contact_visible');
						$('.search-icon-load').addClass('none');
						$('.search-icon-search').removeClass('none');
					});
				}
			});
			localStorage.setItem('group', subgroup);
		});
	}

	function calcTime(offset) {
		// create Date object for current location
		var d = new Date();
	
		// convert to msec
		// subtract local time zone offset
		// get UTC time in msec
		var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
	
		// create new Date object for different city
		// using supplied offset
		var nd = new Date(utc + (3600000*offset));
	
		// return time as a string
		return nd;
	}

	function hideSuggestionBySuggestClick(){
		suggestion.removeClass('suggestion_visible');
		suggestion_active = false;
		suggest.filter('.suggest_hovered').removeClass('suggest_hovered');
	}

	function isSlowConnection(){
		slowConnectionCounter = setTimeout(setStatus, 8000, 4, '');
	}

	function clearSlowConnection(){
		clearTimeout(slowConnectionCounter);
		setStatus(100, '');
	}

	function setStatus(code, message){
		let status = $('.search-status');
		if ((code != null && code != undefined && code != '')
			&& (message != null && message != undefined)){
			if (code == 1){
				// error
				status.addClass('search-status-error');
				status.html(message);
				statusCode = 1;
			}

			else if (code == 2){
				// caution
				status.addClass('search-status-caution');
				status.html(message);
				statusCode = 2;
			}

			else if (code == 3){
				if (status.hasClass('search-status-error')){
					status.removeClass('search-status-error');
				} else if (status.hasClass('search-status-caution')){
					status.removeClass('search-status-caution');
				}
				status.html(message);
				statusCode = 3;
			}

			else if (code == 4){
				// long loading
				status.addClass('search-status-caution');
				status.html('Долго загружается, нужно подождать');
				statusCode = 4;
			}

			else if (code == 50){
				status.addClass('search-status-success');
				status.html(message);
				setTimeout(setStatus, 3000, 100, '');
			}

			else if (code == 100){
				if (status.hasClass('search-status-error')){
					status.removeClass('search-status-error');
				} else if (status.hasClass('search-status-caution')){
					status.removeClass('search-status-caution');
				} else if (status.hasClass('search-status-success')){
					status.removeClass('search-status-success');
				}
				status.html(defaultStatus);
				statusCode = 100;
			}
		}
	}

	function showSuggestion(){
		if (!suggestion_active && main_input.val().length > 0){
			suggestion.addClass('suggestion_visible');
			suggestion_active = true;
		}

		else if (suggestion_active && main_input.val().length == 0){
			suggestion.removeClass('suggestion_visible');
			suggestion_active = false;
			suggest.filter('.suggest_hovered').removeClass('suggest_hovered');
		}
	}

	$('.search-icon-close').click(function(){
		main_input.val('');
		main_input.focus();
		search_block.removeClass('search-block-error');

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			let main_input_position = main_input.offset().top;
			let top_position = $('.headSection').offset().bottom;
			$(document).scrollTop(main_input_position - 10);
		}
	})

	$('.search-icon-search').click(function(){
		main_input.focus();
		search_block.removeClass('search-block-error');
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			let main_input_position = main_input.offset().top;
			let top_position = $('.headSection').offset().bottom;
			$(document).scrollTop(main_input_position - 10);
		}
	})

	main_input.focus(function(){
		search_block.removeClass('search-block-error');
	})

	function connectionError(status, message){
		clearSlowConnection();
		setStatus(status, message);
		search_block.addClass('search-block-error');
		$('.search-icon-load').addClass('none');
		$('.search-icon-search').removeClass('none');
	}

	$('.button-reload').click(function(){
		repaint();
		$(this).addClass('none');
	})

	$('.button-reconnect').click(function(){

		amplitude.getInstance().logEvent('Переподключение интернета');

		$('.button-reconnect').addClass('none');
		search_block.removeClass('search-block-error');
		setStatus(3, 'Переподключение...');

		let groupsLoaded = false;
		let teachersLoaded = false;

		$('.search-icon-load').removeClass('none');
		$('.search-icon-search').addClass('none');

		$.getJSON('//edu.sfu-kras.ru/api/timetable/groups', false, function(data){
			isLoadedGroups = true;
			$.each(data, function(key, value){
				groups.push(value);
			});
			groupsLoaded = true;
			if (teachersLoaded && groupsLoaded){
				$('.search-icon-load').addClass('none');
				$('.search-icon-search').removeClass('none');
				setStatus(50, 'Успешно, теперь можно найти группу или преподавателя');
				// amplitude.getInstance().logEvent('Кнопка переподключения - успешно 1');
			}
		}).fail(function(data, textStatus, xhr){
			if (!hasUserGroup){
				console.log('Ошибка: ' + data + ' ' + textStatus + ' ' + xhr);
				connectionError(1, 'Подключиться не получилось. Попробуйте наладить интернет, перезагрузить страницу или ещё раз переподключиться');
				$('.button-reconnect').removeClass('none');
				amplitude.getInstance().logEvent('Кнопка переподключения - ошибка групп');
			}
		});

		$.getJSON('//edu.sfu-kras.ru/api/timetable/teachers', false, function(data){
			isLoadedTeachers = true;
			$.each(data, function(key, value){
				groups.push(value);
			});
			teachersLoaded = true;
			console.log(teachersLoaded);
			if (teachersLoaded && groupsLoaded){
				$('.search-icon-load').addClass('none');
				$('.search-icon-search').removeClass('none');
				setStatus(50, 'Успешно, теперь можно найти группу или преподавателя');
				// amplitude.getInstance().logEvent('Кнопка переподключения - успешно 2');
			}
		}).fail(function(data, textStatus, xhr){
			if (!hasUserGroup){
				console.log('Ошибка: ' + data + ' ' + textStatus + ' ' + xhr);
				connectionError(1, 'Подключиться не получилось. Попробуйте наладить интернет, перезагрузить страницу или ещё раз переподключиться');
				$('.button-reconnect').removeClass('none');
				amplitude.getInstance().logEvent('Кнопка переподключения - ошибка преподов');
			}
		});
	})

	// делаем расписание
	function makeTimetable(callback){
		$('.weekdays').html('');
		$('.today__block-today').html('');

		search_block.removeClass('search-block-error');
		
		let date_day = new Date().getDate();
		let date_month = new Date().getMonth();
		let week_days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
		let week_days_for_date = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
		let groupName;

		if (localStorage.getItem('group') != undefined)
			groupName = localStorage.getItem('group');
		else
			groupName = $('.main-input').val().toLowerCase();

		$.getJSON(BASE_API_URL + groupName, function(data, status){
			console.log(BASE_API_URL + groupName);
			console.log(data);
			console.log(status.status);
			if (data.timetable.length == 0 && data.timetable != undefined){
				// connectionError(2, 'Ничего не нашлось, потому что расписание только формируется на следующий учебный год. Это займет немного времени.');
				connectionError(1, 'Ничего не нашлось, попробуйте изменить запрос');
				return;
			}

			let date = new Date();
			let currentWeekDay = date.getDay();
			// 1481
			console.log(currentWeekDay);
			let currentDay = date.getDate();
			let currentWeek = getWeekNum(date.getDate(), date.getMonth(), date.getFullYear());
			
			let currentWeekWord;
			if (currentWeek == 1)
				currentWeekWord = 'Нечетная неделя';
			else
				currentWeekWord = 'Четная неделя';

			let day_num = [];
			for (let i = 0; i <= data.timetable.length - 1; i++) {
				day_num.push(data.timetable[i].day);
			}

			let s = 1;
			for (let q= 1; q < day_num.length; ++q) {
				if (day_num[q] !== day_num[q-1]) {
					day_num[s++] = day_num[q];
				}
			}

			day_num.length = s;

			let isUseDay = [false, false, false, false, false, false, false]
			for(var i = 0; i < day_num.length; i++){
				isUseDay[day_num[i]-1] = true
			}

			let today = false;
				
			for (let i = 1; i < 7; i++) {
				if (isUseDay[i-1]){

					if (!today){
						$('.today__block-today').append('<div class="today__container today__container_today">'
						+'<div class="today__header"><div class="today__header-content today__header-content-today">'
						+ '<div class="today__header-title-block">'
						+ '<div class="today__header-title-day today__header-title-day_active today">Сегодня</div>'
						+ '<div class="today__header-title-day tomorrow">Завтра</div>'
						+ '</div><div class="today__header-date">'+ week_days_for_date[currentWeekDay]+ ', ' + currentDay + ' ' + months[date_month]+'</div>'
						+ '</div></div>');

						// console.log(currentWeekDay + ' день недели');

						for (let j = 0; j <= data.timetable.length - 1; j++) {
							if (data.timetable[j].day == currentWeekDay && data.timetable[j].week == currentWeek){
								let subject_num = subject_nums[data.timetable[j].time];
								let subject_type = data.timetable[j].type;
								let subject_time = data.timetable[j].time.replace('-', '–');
								let subject_type_class;
								if (subject_type == 'лабораторная работа')
									subject_type_class = ' type-lab';
								else if (subject_type == 'лекция')
									subject_type_class = ' type-lek';
								else if (subject_type == 'практика')
									subject_type_class = ' type-prak';

								$('.today__container').last().append('<div data-time="'+ data.timetable[j].time +'" class="today__content today__content_today"><div class="today__content-subject">'
								
								+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'
								+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'

								+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
								+ '<div class="today__header-title-circle"></div>'
								+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'

								+ '</div>');

								
								if (data.timetable[j].place != ''){
									$('.today__content-subject-middle').last().append('<div class="today__content-subject-information">'
									+ '<div class="today__content-subject-information-date">'+ data.timetable[j].place +'</div>'
									+ '</div></div>');
								}

								if (data.timetable[j].place != '' && data.timetable[j].teacher != ''){
									$('.today__content-subject-information').last().append('<div class="today__header-title-circle today__header-title-circle_hidden-small"></div>');
								}

								if (data.type == 'group' && data.timetable[j].teacher != ''){
									$('.today__content-subject-information').last().append('<div class="today__content-subject-information-teacher">'
									+ '<span data-url="'+BASE_API_URL + data.timetable[j].teacher +'" class="today__content-subject-information-teacher_group">'+ data.timetable[j].teacher +'</span>'
									+ '</div></div>');

									$('.today__content-subject-information-teacher_group').last().click(function(){
										main_input.val($(this).html());
										let nameForHistory = $(this).html();
										localStorage.setItem('group', $(this).html());
										let inst = 'undefined';
										// for (let index = 0; index < groups.length; index++) {
										// 	if ($(this).html() == groups[index].name){
										// 		inst = groups[index].institute;
										// 		localStorage.setItem('inst', inst);
										// 	}
										// }
										console.log('это институт ' + inst);
										anime({
											targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
											// targets: ['.information', '.contact'],
											duration: anim_time, 
											opacity: 0,
											// scale: 0.99,
											easing: 'easeInOutQuad',
											complete: function(){
												// $('.preloader').removeClass('preloader_invis');

												$('.search-icon-load').removeClass('none');
												$('.search-icon-search').addClass('none');

												window.history.pushState({'name' : nameForHistory}, null, null);
												makeTimetable(function(){
													setInformation(inst);
													showResult();
													getSubTodayNew();
													// getSubToday();
													IS_TIMETABLE_LOADED = true;
													// $('.preloader').addClass('preloader_invis');
													$('.search-icon-load').addClass('none');
													$('.search-icon-search').removeClass('none');
													$('.contact').addClass('contact_visible');
												});
											}
										});
									});
								}

								if (data.type == 'teacher'){
									$('.today__content-subject-information').last().append('<div class="today__content-subject-information-teacher">'
									+ '</div></div>');

									if (data.timetable[j].groups.length == 1){
										$('.today__content-subject-information-teacher').last().html(
											data.timetable[j].groups
										);
									}

									else{
										let groups_str;
										$('.today__content-subject-information-teacher').last().html('');
										for (let o = 0; o <= data.timetable[j].groups.length - 1; o++){
											groups_str += data.timetable[j].groups[o] + ' <br> ';
											// groups_str += data.timetable[j].groups[o] + ' <span class="desktop">&#183</span> <br class="mobile"> ';
										}
										$('.today__content-subject-information-teacher').last().html(groups_str.substr(0, groups_str.length - 6).replace('undefined', ''));
									}
								}
								
								
								$('.today__container').last().append('</div></div></div></div></div>');
								// $('.today__content today__content_inactive').last().remove();
							}

							else if (data.timetable[j].day == currentWeekDay + 1 && currentWeekDay != 0 && data.timetable[j].week == currentWeek){
								let subject_num = subject_nums[data.timetable[j].time];
								let subject_type = data.timetable[j].type;
								let subject_time = data.timetable[j].time.replace('-', '–');
								let subject_type_class;
								if (subject_type == 'лабораторная работа')
									subject_type_class = ' type-lab';
								else if (subject_type == 'лекция')
									subject_type_class = ' type-lek';
								else if (subject_type == 'практика')
									subject_type_class = ' type-prak';

								$('.today__container').last().append('<div class="today__content today__content_tomorrow"><div class="today__content-subject">'
								
								+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'
								
								+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'

								+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
								+ '<div class="today__header-title-circle"></div>'
								+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'

								+ '</div>');
								
								if (data.timetable[j].place != ''){
									$('.today__content-subject-middle').last().append('<div class="today__content-subject-information">'
									+ '<div class="today__content-subject-information-date">'+ data.timetable[j].place +'</div>'
									+ '</div></div>');
								}

								if (data.timetable[j].place != '' && data.timetable[j].teacher != ''){
									$('.today__content-subject-information').last().append('<div class="today__header-title-circle today__header-title-circle_hidden-small"></div>');
								}

								if (data.type == 'group' && data.timetable[j].teacher != ''){
									$('.today__content-subject-information').last().append('<div class="today__content-subject-information-teacher">'
									+ '<span data-url="'+BASE_API_URL + data.timetable[j].teacher +'" class="today__content-subject-information-teacher_group">'+ data.timetable[j].teacher +'</span>'
									+ '</div></div>');

									$('.today__content-subject-information-teacher_group').last().click(function(){
										main_input.val($(this).html());
										localStorage.setItem('group', $(this).html());
										let nameForHistory = $(this).html();
										let inst = 'undefined';
										// for (let index = 0; index < groups.length; index++) {
										// 	if ($(this).html() == groups[index].name){
										// 		inst = groups[index].institute;
										// 		localStorage.setItem('inst', inst);
										// 	}
										// }
										anime({
											targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
											// targets: ['.information', '.contact'],
											duration: anim_time, 
											opacity: 0,
											// scale: 0.99,
											easing: 'easeInOutQuad',
											complete: function(){
												// $('.preloader').removeClass('preloader_invis');
												$('.search-icon-load').removeClass('none');
												$('.search-icon-search').addClass('none');
												window.history.pushState({'name' : nameForHistory}, null, null);
												makeTimetable(function(){
													setInformation(inst);
													showResult();
													getSubTodayNew();
													// getSubToday();
													IS_TIMETABLE_LOADED = true;
													// $('.preloader').addClass('preloader_invis');
													$('.search-icon-load').addClass('none');
													$('.search-icon-search').removeClass('none');
													$('.contact').addClass('contact_visible');
												});
											}
										});
									});
								}

								if (data.type == 'teacher'){
									$('.today__content-subject-information').last().append('<div class="today__content-subject-information-teacher">'
									+ '</div></div>');

									if (data.timetable[j].groups.length == 1){
										$('.today__content-subject-information-teacher').last().html(
											data.timetable[j].groups
										);
									}

									else{
										let groups_str;
										$('.today__content-subject-information-teacher').last().html('');
										for (let o = 0; o <= data.timetable[j].groups.length - 1; o++){
											groups_str += data.timetable[j].groups[o] + ' <br> ';
											// groups_str += data.timetable[j].groups[o] + ' <span class="desktop">&#183</span> <br class="mobile"> ';
										}
										$('.today__content-subject-information-teacher').last().html(groups_str.substr(0, groups_str.length - 6).replace('undefined', ''));
									}
								}
								
								
								$('.today__container').last().append('</div></div></div></div></div>')
							}

							else if (data.timetable[j].day == currentWeekDay + 1 && currentWeekDay == 0 && data.timetable[j].week != currentWeek){
								console.log('завтра понедельник');
								let subject_num = subject_nums[data.timetable[j].time];
								let subject_type = data.timetable[j].type;
								let subject_time = data.timetable[j].time.replace('-', '–');
								let subject_type_class;
								if (subject_type == 'лабораторная работа')
									subject_type_class = ' type-lab';
								else if (subject_type == 'лекция')
									subject_type_class = ' type-lek';
								else if (subject_type == 'практика')
									subject_type_class = ' type-prak';

								$('.today__container').last().append('<div class="today__content today__content_tomorrow"><div class="today__content-subject">'
								
								+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'
								
								+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'
								
								+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
								+ '<div class="today__header-title-circle"></div>'
								+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'

								+ '</div>');
								
								if (data.timetable[j].place != ''){
									$('.today__content-subject-middle').last().append('<div class="today__content-subject-information">'
									+ '<div class="today__content-subject-information-date">'+ data.timetable[j].place +'</div>'
									+ '</div></div>');
								}

								if (data.timetable[j].place != '' && data.timetable[j].teacher != ''){
									$('.today__content-subject-information').last().append('<div class="today__header-title-circle today__header-title-circle_hidden-small"></div>');
								}

								if (data.type == 'group' && data.timetable[j].teacher != ''){
									$('.today__content-subject-information').last().append('<div class="today__content-subject-information-teacher">'
									+ '<span data-url="'+BASE_API_URL + data.timetable[j].teacher +'" class="today__content-subject-information-teacher_group">'+ data.timetable[j].teacher +'</span>'
									+ '</div></div>');

									$('.today__content-subject-information-teacher_group').last().click(function(){
										main_input.val($(this).html());
										localStorage.setItem('group', $(this).html());
										let nameForHistory = $(this).html();
										let inst = 'undefined';
										// for (let index = 0; index < groups.length; index++) {
										// 	if ($(this).html() == groups[index].name){
										// 		inst = groups[index].institute;
										// 		localStorage.setItem('inst', inst);
										// 	}
										// }
										anime({
											targets: ['.weekdays', '.information', '.today__block-today', '.contact'],
											// targets: ['.information', '.contact'],
											duration: anim_time, 
											opacity: 0,
											// scale: 0.99,
											easing: 'easeInOutQuad',
											complete: function(){
												// $('.preloader').removeClass('preloader_invis');
												$('.search-icon-load').removeClass('none');
												$('.search-icon-search').addClass('none');
												window.history.pushState({'name' : nameForHistory}, null, null);
												makeTimetable(function(){
													setInformation(inst);
													showResult();
													getSubTodayNew();
													// getSubToday();
													IS_TIMETABLE_LOADED = true;
													// $('.preloader').addClass('preloader_invis');
													$('.search-icon-load').addClass('none');
													$('.search-icon-search').removeClass('none');
													$('.contact').addClass('contact_visible');
												});
											}
										});
									});
								}

								if (data.type == 'teacher'){
									$('.today__content-subject-information').last().append('<div class="today__content-subject-information-teacher">'
									+ '</div></div>');

									if (data.timetable[j].groups.length == 1){
										$('.today__content-subject-information-teacher').last().html(
											data.timetable[j].groups
										);
									}

									else{
										let groups_str;
										$('.today__content-subject-information-teacher').last().html('');
										for (let o = 0; o <= data.timetable[j].groups.length - 1; o++){
											groups_str += data.timetable[j].groups[o] + ' <br> ';
											// groups_str += data.timetable[j].groups[o] + ' <span class="desktop">&#183</span> <br class="mobile"> ';
										}
										$('.today__content-subject-information-teacher').last().html(groups_str.substr(0, groups_str.length - 6).replace('undefined', ''));
									}
								}
								
								
								$('.today__container').last().append('</div></div></div></div></div>')
							}
						}


						$('.today__header-divider').last().remove();
						$('.today__header-divider_inactive').last().remove();

						today = true;
					}



					$('.weekdays').append('<div id="'+ i +'" class="today__container today__container_weekday"><div class="today__header">'
					+'<div class="today__header-content"><div class="today__header-title-block_weekday">'
					+'<div class="today__header-title-weekday">'+ week_days[i - 1] +'</div>'
					+'<button class="today__header-change-week-button">'
					+'<div class="today__header-change-week-button-content">'+ currentWeekWord +'</div></button></div>'
					+'</div></div>'
					// +'<hr class="today__header-divider">'
					+'</div></div>');
					for (let j = 0; j <= data.timetable.length - 1; j++) {
	
						if (data.timetable[j].day == i && data.timetable[j].week == currentWeek
							&& data.timetable[j].teacher != '' && data.timetable[j].place != ''){
							
							let subject_num = subject_nums[data.timetable[j].time];
							let subject_type = data.timetable[j].type;
							let subject_time = data.timetable[j].time.replace('-', '–');
							let subject_type_class;
							if (subject_type == 'лабораторная работа')
								subject_type_class = ' type-lab';
							else if (subject_type == 'лекция')
								subject_type_class = ' type-lek';
							else if (subject_type == 'практика')
								subject_type_class = ' type-prak';

							$('.today__container').last().append('<div class="today__content today__content_active"><div class="today__content-subject">'
							+ '<div class="today__content-subject-middle">'
							
							+ '<div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'

							+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'

							+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
							+ '<div class="today__header-title-circle"></div>'
							+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'
							// + '<div class="today__content-subject-type">'+ subject_type.toUpperCase() +'</div>'
							+ '</div>'

							+ '<div class="today__content-subject-information"><div class="today__content-subject-information-date">'+ data.timetable[j].place +'</div>'
							+ '<div class="today__header-title-circle today__header-title-circle_hidden-small"></div>'
							+ '<div class="today__content-subject-information-teacher">'
							+ '<span data-url="'+BASE_API_URL + data.timetable[j].teacher +'" class="today__content-subject-information-teacher_group">'+ data.timetable[j].teacher +'</span>'
							+ '</div></div></div></div></div>');
						}
	
						else if (data.timetable[j].day == i && data.timetable[j].week == currentWeek
							&& data.timetable[j].teacher == '' && data.timetable[j].place != ''){
	
							let subject_num = subject_nums[data.timetable[j].time];
							let subject_time = data.timetable[j].time.replace('-', '–');
							let subject_type = data.timetable[j].type;
							let subject_type_class;
							if (subject_type == 'лабораторная работа')
								subject_type_class = ' type-lab';
							else if (subject_type == 'лекция')
								subject_type_class = ' type-lek';
							else if (subject_type == 'практика')
								subject_type_class = ' type-prak';
	
							$('.today__container').last().append('<div class="today__content today__content_active"><div class="today__content-subject">'
							+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'

							+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'
							+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
							+ '<div class="today__header-title-circle"></div>'
							+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'

							// + '<div class="today__content-subject-type">'+ subject_type.toUpperCase() +'</div>'
							+ '</div>'

							+ '<div class="today__content-subject-information"><div class="today__content-subject-information-date">'+ data.timetable[j].place +'</div>'
							+ '</div></div></div></div></div>');
						}
	
						else if (data.timetable[j].day == i && data.timetable[j].week == currentWeek
							&& data.timetable[j].teacher != '' && data.timetable[j].place == ''){
	
							let subject_num = subject_nums[data.timetable[j].time];
							let subject_time = data.timetable[j].time.replace('-', '–');
							let subject_type = data.timetable[j].type;
							let subject_type_class;
							if (subject_type == 'лабораторная работа')
								subject_type_class = ' type-lab';
							else if (subject_type == 'лекция')
								subject_type_class = ' type-lek';
							else if (subject_type == 'практика')
								subject_type_class = ' type-prak';
	
							$('.today__container').last().append('<div class="today__content today__content_active"><div class="today__content-subject">'
							
							+' <div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'

							+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'
							+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
							+ '<div class="today__header-title-circle"></div>'
							+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'
							// + '<div class="today__content-subject-type">'+ subject_type.toUpperCase() +'</div>'
							+ '</div>'

							+ '<div class="today__content-subject-information">'
							+ '<div class="today__content-subject-information-teacher">'
							+ '<span data-url="'+BASE_API_URL + data.timetable[j].teacher +'" class="today__content-subject-information-teacher_group">'+ data.timetable[j].teacher +'</span>'
							+ '</div></div></div></div></div>');
						}
	
						else if (data.timetable[j].day == i && data.timetable[j].week == currentWeek
							&& data.timetable[j].teacher == '' && data.timetable[j].place == ''){
							
							let subject_num = subject_nums[data.timetable[j].time];
							let subject_time = data.timetable[j].time.replace('-', '–');
							let subject_type = data.timetable[j].type;
							let subject_type_class;
							if (subject_type == 'лабораторная работа')
								subject_type_class = ' type-lab';
							else if (subject_type == 'лекция')
								subject_type_class = ' type-lek';
							else if (subject_type == 'практика')
								subject_type_class = ' type-prak';
	
							$('.today__container').last().append('<div class="today__content today__content_active"><div class="today__content-subject">'
							+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'

							+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'
							+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
							+ '<div class="today__header-title-circle"></div>'
							+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'
							// + '<div class="today__content-subject-type">'+ subject_type.toUpperCase() +'</div>'
							+ '</div>'

							+ '</div></div></div></div>');
						}


						else if (data.timetable[j].day == i && data.timetable[j].week != currentWeek
							&& data.timetable[j].teacher != '' && data.timetable[j].place != ''){
							
							let subject_num = subject_nums[data.timetable[j].time];
							let subject_time = data.timetable[j].time.replace('-', '–');
							let subject_type = data.timetable[j].type;
							let subject_type_class;
							if (subject_type == 'лабораторная работа')
								subject_type_class = ' type-lab';
							else if (subject_type == 'лекция')
								subject_type_class = ' type-lek';
							else if (subject_type == 'практика')
								subject_type_class = ' type-prak';

							$('.today__container').last().append('<div class="today__content today__content_inactive"><div class="today__content-subject">'
							+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'

							+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'
							+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
							+ '<div class="today__header-title-circle"></div>'
							+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'
							// + '<div class="today__content-subject-type">'+ subject_type.toUpperCase() +'</div>'
							+ '</div>'

							+ '<div class="today__content-subject-information"><div class="today__content-subject-information-date">'+ data.timetable[j].place +'</div>'
							+ '<div class="today__header-title-circle today__header-title-circle_hidden-small"></div>'
							+ '<div class="today__content-subject-information-teacher">'
							+ '<span data-url="'+BASE_API_URL + data.timetable[j].teacher +'" class="today__content-subject-information-teacher_group">'+ data.timetable[j].teacher +'</span>'
							+ '</div></div></div></div></div>');
						}

						else if (data.timetable[j].day == i && data.timetable[j].week != currentWeek
							&& data.timetable[j].teacher == '' && data.timetable[j].place != ''){
	
							let subject_num = subject_nums[data.timetable[j].time];
							let subject_time = data.timetable[j].time.replace('-', '–');
							let subject_type = data.timetable[j].type;
							let subject_type_class;
							if (subject_type == 'лабораторная работа')
								subject_type_class = ' type-lab';
							else if (subject_type == 'лекция')
								subject_type_class = ' type-lek';
							else if (subject_type == 'практика')
								subject_type_class = ' type-prak';
	
							$('.today__container').last().append('<div class="today__content today__content_inactive"><div class="today__content-subject">'
							+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'

							+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'
							+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
							+ '<div class="today__header-title-circle"></div>'
							+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'
							// + '<div class="today__content-subject-type">'+ subject_type.toUpperCase() +'</div>'
							+ '</div>'

							+ '<div class="today__content-subject-information"><div class="today__content-subject-information-date">'+ data.timetable[j].place +'</div>'
							+ '</div></div></div></div></div>');
						}

						else if (data.timetable[j].day == i && data.timetable[j].week != currentWeek
							&& data.timetable[j].teacher != '' && data.timetable[j].place == ''){
	
							let subject_num = subject_nums[data.timetable[j].time];
							let subject_time = data.timetable[j].time.replace('-', '–');
							let subject_type = data.timetable[j].type;
							let subject_type_class;
							if (subject_type == 'лабораторная работа')
								subject_type_class = ' type-lab';
							else if (subject_type == 'лекция')
								subject_type_class = ' type-lek';
							else if (subject_type == 'практика')
								subject_type_class = ' type-prak';
	
							$('.today__container').last().append('<div class="today__content today__content_inactive"><div class="today__content-subject">'
							+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'

							+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'
							+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
							+ '<div class="today__header-title-circle"></div>'
							+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'
							// + '<div class="today__content-subject-type">'+ subject_type.toUpperCase() +'</div>'
							+ '</div>'

							+ '<div class="today__content-subject-information">'
							+ '<div class="today__content-subject-information-teacher">'
							+ '<span data-url="'+BASE_API_URL + data.timetable[j].teacher +'" class="today__content-subject-information-teacher_group">'+ data.timetable[j].teacher +'</span>'
							+ '</div></div></div></div></div>');
						}

						else if (data.timetable[j].day == i && data.timetable[j].week != currentWeek
							&& data.timetable[j].teacher == '' && data.timetable[j].place == ''){
							
							let subject_num = subject_nums[data.timetable[j].time];
							let subject_time = data.timetable[j].time.replace('-', '–');
							let subject_type = data.timetable[j].type;
							let subject_type_class;
							if (subject_type == 'лабораторная работа')
								subject_type_class = ' type-lab';
							else if (subject_type == 'лекция')
								subject_type_class = ' type-lek';
							else if (subject_type == 'практика')
								subject_type_class = ' type-prak';
	
							$('.today__container').last().append('<div class="today__content today__content_inactive"><div class="today__content-subject">'
							+ '<div class="today__content-subject-middle"><div class="today__content-subject-content">'+ data.timetable[j].subject +'</div>'

							+ '<div class="today__content-subject-top"><div class="today__content-subject-time">'
							+ '<div class="today__content-subject-time-content today__content-subject-time-content-time">'+ '<span class="subject-time-strong">'+ subject_time.substr(0, 5) +'</span><span class="subject-time-opacity">'+ subject_time.substr(5, 7) +'</span></div>'
							+ '<div class="today__header-title-circle"></div>'
							+ '<div class="today__content-subject-time-content'+ subject_type_class +'">'+ subject_type.toLowerCase() + '</div></div>'
							// + '<div class="today__content-subject-type">'+ subject_type.toUpperCase() +'</div>'
							+ '</div>'

							+ '</div></div></div></div>');
						}

						if (data.type == 'teacher'){
							$('.today__content-subject-information-teacher_group').last().unbind('click');
							// console.log('teacher');
							if (data.timetable[j].groups.length == 1){
								$('.today__content-subject-information-teacher').last().html(
									data.timetable[j].groups
								);
							}

							else{
								let groups_str;
								$('.today__content-subject-information-teacher').last().html('');
								for (let o = 0; o <= data.timetable[j].groups.length - 1; o++){
									groups_str += data.timetable[j].groups[o] + ' <br> ';
									// groups_str += data.timetable[j].groups[o] + ' <span class="desktop">&#183</span> <br class="mobile">';
								}
								// if (data.timetable[j].groups.length > 4){
								// 	$('.today__content-subject-information-teacher').last().prev().css('display', 'none');
								// 	$('.today__content-subject-information-teacher').last().parent().css('flex-flow', 'column');
								// 	$('.today__content-subject-information-teacher').last().parent().css('align-items', 'start');
								// }
								$('.today__content-subject-information-teacher').last().html(groups_str.substr(0, groups_str.length - 6).replace('undefined', ''));
							}
						}

						else if (data.type == 'group'){
							$('.today__content-subject-information-teacher_group').last().unbind('click');
							$('.today__content-subject-information-teacher_group').last().click(function(){
								main_input.val($(this).html());
								let nameForHistory = $(this).html();
								localStorage.setItem('group', $(this).html());
								let inst = 'undefined';
								// for (let index = 0; index < groups.length; index++) {
								// 	if ($(this).html() == groups[index].name){
								// 		inst = groups[index].institute;
								// 		localStorage.setItem('inst', inst);
								// 	}
								// }
								anime({
									targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
									// targets: ['.information', '.contact'],
									duration: anim_time, 
									opacity: 0,
									// scale: 0.99,
									easing: 'easeInOutQuad',
									complete: function(){
										// $('.preloader').removeClass('preloader_invis');
										$('.search-icon-load').removeClass('none');
										$('.search-icon-search').addClass('none');
										window.history.pushState({'name' : nameForHistory}, null, null);
										makeTimetable(function(){
											setInformation(inst);
											showResult();
											getSubTodayNew();
											// getSubToday();
											IS_TIMETABLE_LOADED = true;
											// $('.preloader').addClass('preloader_invis');
											$('.search-icon-load').addClass('none');
											$('.search-icon-search').removeClass('none');
											$('.contact').addClass('contact_visible');
										});
									}
								});
							});
						}
					}

					$('.today__header-divider').last().css('display', 'none');
					date_day = date_day + 1;
				}

				
				// $('.today__content-subject-information-teacher').each(function(){
				// 	// console.log('type000 - ' + $(this).html());
				// 	if ($(this).html() == 'undefined' && data.type == 'teacher'){
				// 		// console.log('type - ' + $(this).html());
				// 		// $(this).html(data.timetable[j].groups);
				// 		$(this).css('display', 'none');
				// 		$(this).prev().css('display', 'none');
				// 	}
				// });

				$('.today__container').each(function(){

					$(this).children('.today__content_active').last().find('.today__content-subject-middle').css('border-bottom', "1px solid transparent");
					$(this).children('.today__content_inactive').last().find('.today__content-subject-middle').css('border-bottom', "1px solid transparent");
					$(this).children('.today__content_today').last().find('.today__content-subject-middle').css('border-bottom', "1px solid transparent");
					$(this).children('.today__content_tomorrow').last().find('.today__content-subject-middle').css('border-bottom', "1px solid transparent");

					if ($(this).children('.today__content_today').length == 0 && $(this).hasClass('today__container_today')){
						$(this).append('<div class="today__content today__content_today">'
						+'<div class="today__content-subject today__content-subject_empty">Сегодня занятий нет, отдыхайте</div></div>');
						// $(this).children('.today__header-divider_inactive').first().css('display', 'block');
						$(this).attr('data-today_empty', 'true');
						$(this).addClass('today__container_empty');
					}

					else if ($(this).children('.today__content_tomorrow').length == 0 && $(this).hasClass('today__container_today')){
						$(this).append('<div class="today__content today__content_tomorrow">'
						+'<div class="today__content-subject today__content-subject_empty">Завтра занятий нет</div></div>');
						// $(this).children('.today__header-divider_inactive').first().css('display', 'block');
						$(this).attr('data-tomorrow_empty', 'true');
						// $(this).addClass('today__container_empty');
					}

					if ($(this).children('.today__content_active').length == 0 && $(this).hasClass('today__container_weekday')){
						$(this).append('<div class="today__content today__content_active">'
						+'<div class="today__content-subject today__content-subject_empty">Занятий нет</div></div>');
						$(this).children('.today__header-divider').first().css('display', 'block');
						// $(this).attr('data-currentDay_empty', 'true');
						// $(this).addClass('today__container_empty');
					}

					else if ($(this).children('.today__content_inactive').length == 0 && $(this).hasClass('today__container_weekday')){
						$(this).append('<div class="today__content today__content_inactive">'
						+'<div class="today__content-subject today__content-subject_empty">Занятий нет</div></div>');
						$(this).children('.today__header-divider').first().css('display', 'block');
						// $(this).attr('data-nextDay_empty', 'true');
						// $(this).addClass('today__container_empty');
					}
				});

				$('.today__header-change-week-button').last().off('click');

				$('.today__header-change-week-button').last().on('click', function(){

					ym(56325538,'reachGoal','changeDay');	
					amplitude.getInstance().logEvent('Смена недели дня');

					console.log('Смена дня');

					let day = $(this).parent().parent().parent().parent();
					let button = $(this);
					let weeks = ['Четная неделя', 'Нечетная неделя']; let new_week;
					day.addClass('today__container-change-week');

					if (button.children('.today__header-change-week-button-content').html() == weeks[0])
						new_week = weeks[1];
					else
						new_week = weeks[0];

					anime({
						targets: '.today__container-change-week',
						duration: 200, 
						opacity: 0.7,
						// scale: 0.99,
						easing: 'easeInOutQuad',
						complete: function(){
							day.children('.today__content_active').toggleClass('today_invisible');
							day.children('.today__content_inactive').toggleClass('today_visible');
							day.children('.today__header-divider').toggleClass('today_invisible');
							day.children('.today__header-divider_inactive').toggleClass('today_visible');
							day.children('.today__header-divider').first().css('display', 'block');
							day.children('.today__header-divider_inactive').last().toggleClass('today_invisible');
							button.children('.today__header-change-week-button-content').html(new_week);
							anime({
								targets: '.today__container-change-week',
								duration: 200, 
								opacity: 1,
								easing: 'easeInOutQuad',
								complete: function(){
									day.removeClass('today__container-change-week');
								}
							});
						}
					});
				});
			}

			$('.tomorrow').on('click', function(){

				if ($(this).hasClass('today__header-title-day_active')){
					return;
				}
				ym(56325538,'reachGoal','tomorrow');
				amplitude.getInstance().logEvent('Завтра');
				$(this).toggleClass('today__header-title-day_active');
				$('.today').toggleClass('today__header-title-day_active');
				let currentNextDay = currentDay + 1;
				// <div class="today__header-date">'+ week_days[currentWeekDay]+ ', ' + currentDay + ' ' + months[date_month]+'</div>
				let day = $(this).parent().parent().parent().parent();
				if (day.attr('data-tomorrow_empty') == 'true'){
					day.addClass('today__container_empty');
				}
				else{
					day.removeClass('today__container_empty');
				}
				// day.removeClass('today__container_empty');
				// console.log(day + ' это день');

				day.children('.today__content_today').toggleClass('today_invisible');
				day.children('.today__content_tomorrow').toggleClass('today_visible');
				day.children('.today__header-divider').toggleClass('today_invisible');
				day.children('.today__header-divider_inactive').toggleClass('today_visible');
				// day.children('.today__header-divider').first().css('display', 'block');
				$('.today__header-date').first().html(week_days_for_date[currentWeekDay + 1] + ', ' + currentNextDay + ' ' + months[date_month]);
			});

			$('.today').on('click', function(){

				if ($(this).hasClass('today__header-title-day_active')){
					return;
				}
				ym(56325538,'reachGoal','today');
				amplitude.getInstance().logEvent('Сегодня');
				$(this).toggleClass('today__header-title-day_active');
				$('.tomorrow').toggleClass('today__header-title-day_active');
				let day = $(this).parent().parent().parent().parent();
				if (day.attr('data-today_empty') == 'true'){
					day.addClass('today__container_empty');
				}
				else{ day.removeClass('today__container_empty'); }
				// console.log(day + ' это день');

				day.children('.today__content_today').toggleClass('today_invisible');
				day.children('.today__content_tomorrow').toggleClass('today_visible');
				day.children('.today__header-divider').toggleClass('today_invisible');
				day.children('.today__header-divider_inactive').toggleClass('today_visible');
				// day.children('.today__header-divider').first().css('display', 'block');
				$('.today__header-date').first().html(week_days_for_date[currentWeekDay] + ', ' + currentDay + ' ' + months[date_month]);
			});


			//localStorage.setItem('table', JSON.stringify(data));
			callback();

		}).fail(function(data, textStatus, xhr){
			console.log('Ошибка: ' + data + ' ' + textStatus + ' ' + xhr);
			connectionError(1, 'Проблемы с интернетом. Попробуйте переподключиться или перезагрузить страницу');
			$('.button-reload').removeClass('none');
			// if (data.status == 0){
			// 	connectionError(1, 'Проблемы с соединением. Попробуйте переотправить запрос или перезагрузить страницу');
			// 	$('.button-reload').removeClass('none');
			// }
		});
	}

	function setInformation(inst){
		//$('.subgroup_change_name').last().unbind('click');
		//$('.subgroup_change_name').first().unbind('click');

		let date = new Date();
		let week = getWeekNum(date.getDate(), date.getMonth(), date.getFullYear());
		$('.week-new__1').removeClass('week-new_active');
		$('.week-new__2').removeClass('week-new_active');
		$('.week-new__1').removeAttr('data-active');
		$('.week-new__2').removeAttr('data-active');
		$('.uneversity_name').removeClass('uneversity_name_teacher');
		// $('.week').html('Нечётная неделя');
		// console.log(week + 'неделя сейчас');
		if (week == 1){
			$('.week2').html('Идет нечетная неделя');
			$('.week-new__1').addClass('week-new_active_permanent');
			$('.week-new__1').addClass('week-new_active');
			$('.week-new__1').attr('data-active', 'true');
		}
		else{
			$('.week2').html('Идет четная неделя');
			$('.week-new__2').addClass('week-new_active_permanent');
			$('.week-new__2').addClass('week-new_active');
			$('.week-new__2').attr('data-active', 'true');
		}

		let name; 
		if (localStorage.getItem('group') != undefined){
			name = localStorage.getItem('group');
			main_input.val(name);
		}
		else
			name = main_input.val();

		$('.subgroup_name_new').each(function(){
			$(this).removeClass('subgroup_name_new_active');
		});

		$('.subgroups').html('');

		// Создаём паттерны поиска подгрупп
		let pat1 = RegExp('(.*)(\\(подгруппа\\s\\d\\))$');
		let pat2 = RegExp('(.*)(\\(\\d\\sподгруппа\\))$');
		let pat3 = RegExp('(.*)(\\(\\d\\))$');
		let pat4 = RegExp('(.*)\\s(\\d\\sподгруппа)$');
		let pat5 = RegExp('(.*)(\\/\\d[бмБМ])$');
		let pat6 = RegExp('(.*)(\\([абвгд]\\))$');
		
		// Определяем паттерн группы
		var GROUPwithout = "";
		var SBGroup = "";
		var isHasPattern = true;
		var isPat5 = false;
		if (pat1.test(name)){
			GROUPwithout = pat1.exec(name)[1];
			SBGroup = pat1.exec(name)[2];
			pat1.lastIndex = 0;
		} else {
			if (pat2.test(name)){
				GROUPwithout = pat2.exec(name)[1];
				SBGroup = pat2.exec(name)[2];
				pat2.lastIndex = 0;
				// console.log(pat2.exec(name));
			}else{
				if (pat3.test(name)){
					GROUPwithout = pat3.exec(name)[1];
					SBGroup = pat3.exec(name)[2];
					pat3.lastIndex = 0;
				}else{
					if (pat4.test(name)){
						GROUPwithout = pat4.exec(name)[1];
						SBGroup = pat4.exec(name)[2];
						pat4.lastIndex = 0;
					}else{
						if (pat5.test(name)){
							GROUPwithout = pat5.exec(name)[1];
							SBGroup = pat5.exec(name)[2];
							isPat5 = true;
							pat5.lastIndex = 0;
						}else{
							if (pat6.test(name)){
								GROUPwithout = pat6.exec(name)[1];
								SBGroup = pat6.exec(name)[2];
								pat6.lastIndex = 0;
							}else{
								isHasPattern = false;
							}
						}
					}
				}
			}
		}
		// Создаём массив подгрупп
		if (isHasPattern){
			var subgroups = [];
			var SubgroupsPattern
			if (isPat5){
				SubgroupsPattern = RegExp(`^${GROUPwithout}.+`);
			}else{
				SubgroupsPattern = RegExp(`^${GROUPwithout}.*`);
			}
			var CurrentSubGroup = 0;
			for(var i = 0; i < groups.length; i++){
				if(SubgroupsPattern.test(groups[i].name)){
					subgroups.push(groups[i].name);
					SubgroupsPattern.lastIndex = 0;
				}
				// console.log("100500");
			}
			for(var i = 0; i < subgroups.length; i++){
				if (subgroups[i] === name){
					CurrentSubGroup = i + 1;
					break;
				}
			}
			// console.log(CurrentSubGroup + " - Наша цель");
			// $('.subgroup_name').html(CurrentSubGroup + ' подгруппа');
			$('.group_name').html(GROUPwithout.trim());
			

			for(var i = 0; i < subgroups.length; i++){
				$('.subgroups').append('<div data-group-to-set="' + BASE_API_URL + subgroups[i] + '" class="subgroup_name_new">' + (i + 1) + ' подгруппа</div>');
				if (i != (CurrentSubGroup-1)){
					SBClick(subgroups[i], i, inst, IS_TIMETABLE_LOADED, main_input);
				}
			}

			$('.subgroup_name_new').eq(CurrentSubGroup-1).addClass('subgroup_name_new_active');
			// $('.subgroups').flickity({
			// 	// options
			// 	freeScroll: true,
			// 	draggable: true,
			// 	prevNextButtons: false,
			// 	pageDots: false
			// });
		}
		
		else{
			$('.group_name').html(name);
		}

		let inst_full;
		if (inst){
			for (let key in insts) {
				if (inst == key){
					inst_full = key;
					inst = insts[key];
				}
			}

			// console.log(inst + '1111');
			if (inst == 'undefined'){
				console.log('undefined');
				inst = 'преподаватель';
				if (main_input.val().indexOf(',') != -1){
					inst = 'преподаватели';
				}
				$('.uneversity_name').first().html(inst);
				return;
			} else{
				console.log('преподаватель');
				if (inst == 'преподаватели' && main_input.val().indexOf(',') == -1){
					inst = 'преподаватель';
					$('.uneversity_name').first().html(inst);
					return;
				}
				$('.uneversity_name').first().html(inst + ' — ' + inst_full);
			}
		}
	}

	function week_new_click(){
		if (!$(this).attr('data-active')){
			ym(56325538,'reachGoal','changeAllWeek');
			amplitude.getInstance().logEvent('Смена недели');
			$('.week-new__1').removeClass('week-new_active');
			$('.week-new__2').removeClass('week-new_active');
			$('.week-new__1').removeAttr('data-active');
			$('.week-new__2').removeAttr('data-active');
			$(this).addClass('week-new_active');
			$(this).attr('data-active', 'true');
			let week_current = $(this).html();
			console.log(week_current);

			console.log('Смена недели');
	
			$('.today__container').each(function(){
				let need_to_change;
				let day = $(this);
				let weeks = ['Четная неделя', 'Нечетная неделя']; let new_week;
				let button = $(this).find('.today__header-change-week-button-content');
				
				// console.log(button.html());
				if (button.html() == 'Четная неделя' && week_current == 'Нечетная неделя'){
					need_to_change = true;
					// console.log('меняться');
				}
				else if (button.html() == 'Нечетная неделя' && week_current == 'Четная неделя'){
					need_to_change = true;
					// console.log('меняться');
				}
				else if (button.html() == 'Четная неделя' && week_current == 'Четная неделя'){
					need_to_change = false;
					// console.log('не меняться');
				}
				else if (button.html() == 'Нечетная неделя' && week_current == 'Нечетная неделя'){
					need_to_change = false;
					// console.log('не меняться');
				}


				if (button.html() == weeks[0])
					new_week = weeks[1];
				else
					new_week = weeks[0];


				if (need_to_change){
					day.children('.today__content_active').toggleClass('today_invisible');
					day.children('.today__content_inactive').toggleClass('today_visible');
					day.children('.today__header-divider').toggleClass('today_invisible');
					day.children('.today__header-divider_inactive').toggleClass('today_visible');
					day.children('.today__header-divider').first().css('display', 'block');
					day.children('.today__header-divider_inactive').last().toggleClass('today_invisible');
					button.html(new_week);
				}
			});
		}

	}

	$('.logo_link').click(function(){
		amplitude.getInstance().logEvent('Переход на СФУ');
	});

	$('.contact__a').click(function(){
		amplitude.getInstance().logEvent('Переход ВКонтакте');
	});
	
	$('.week-new__1').click(week_new_click);
	$('.week-new__2').click(week_new_click);

	main_input.on('keyup', function (eventObject){
		if (eventObject.which != 27){
			let maximum = 4; let index = 0;
			if (main_input.val().length >= 0){

				var searchField = main_input.val();
				var expression = new RegExp(delCharReg(searchField), "gi");

				let arSuggests = []
				// console.log(groups.reverse());
				$.each(groups, function(key, value){
					if (delCharSTR(value.name).search(expression) == 0)
					{
						if (index < maximum){
							// console.log(value.name - searchField);
							// let content = '<strong>'+ searchField +'</strong>'+ value.name.replace(searchField, '');
							arSuggests.push('<div class="suggest" data-teacher="'+ value.type +'" data-inst="'+ value.institute +'" data-group="'+value.name+'">' + value.name + '</div>');
							index = index + 1;
						}
					}
				});
				let shownSuggest = "";
				for(var i = 0; i < arSuggests.length; i++){
					shownSuggest += arSuggests[i]
				}
				suggestion.html(shownSuggest);
				if (suggestion.children().length != 0){
					setStatus(100, '');
					showSuggestion();
					// amplitude.getInstance().logEvent('Показ списка групп');
				} else{
					console.log('ничего не найдено');
					hideSuggestionBySuggestClick();
					if (isLoadedGroups && isLoadedTeachers){
						// setStatus(2, 'Ничего не найдено, потому что расписание только формируется на следующий учебный год. Это займет немного времени');
						setStatus(2, 'Ничего не найдено, попробуйте изменить запрос');
						// amplitude.getInstance().logEvent('Ничего не найдено');
					} else{
						setStatus(1, 'Проблемы с интернетом. Попробуйте переподключиться или перезагрузить страницу');
						amplitude.getInstance().logEvent('Нет интернета');
						$('.button-reconnect').removeClass('none');
					}
				}
				$('.suggest').on('click', function(){
					hideSuggestionBySuggestClick();
					$('.search-icon-load').removeClass('none');
					$('.search-icon-search').addClass('none');
					setStatus(3, 'Загрузка...');

					amplitude.getInstance().logEvent('Выбор группы', {'group' : $(this).attr('data-group')});

					main_input.val($(this).attr('data-group'));
					
					let nameForHistory = $(this).attr('data-group');

					let inst = $(this).attr('data-inst');

					localStorage.setItem('inst', inst);
					localStorage.setItem('name', $(this).attr('data-group'));
					localStorage.setItem('group', $(this).attr('data-group'));

					if (IS_TIMETABLE_LOADED){
						// console.log('loading');
						anime({
							targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
							// targets: ['.information', '.contact'],
							duration: anim_time, 
							opacity: 0,
							// scale: 0.99,
							easing: 'easeInOutQuad',
							complete: function(){
								window.history.pushState({'name' : nameForHistory}, null, null);
								isSlowConnection();
								makeTimetable(function(){
									clearSlowConnection();
									setStatus(100, '');
									console.log('интервал очищен');
									setInformation(inst);
									showResult();
									getSubTodayNew();
									// amplitude.getInstance().logEvent('Показ расписания');
									// getSubToday();
									IS_TIMETABLE_LOADED = true;
									localStorage.setItem('IS_TIMETABLE_LOADED', true);
									// $('.preloader').addClass('preloader_invis');
									$('.search-icon-load').addClass('none');
									$('.search-icon-search').removeClass('none');
									$('.contact').addClass('contact_visible');
									// console.log(IS_TIMETABLE_LOADED);
								});
							}
						});
					}

					else{
						// $('.preloader').removeClass('preloader_invis');
						$('.search-icon-load').removeClass('none');
						$('.search-icon-search').addClass('none');
						window.history.pushState({'name' : nameForHistory}, null, null);
						makeTimetable(function(){
							setStatus(100, '');
							setInformation(inst);
							showResult();
							// getSubToday();
							getSubTodayNew();
							IS_TIMETABLE_LOADED = true;
							localStorage.setItem('IS_TIMETABLE_LOADED', true);
							// $('.preloader').addClass('preloader_invis');
							$('.search-icon-load').addClass('none');
							$('.search-icon-search').removeClass('none');
							$('.contact').addClass('contact_visible');
							// console.log(IS_TIMETABLE_LOADED);
						});
					}

				});
			}

			else if(main_input.val().length >= 0 && main_input.val().length < 4){
				if (isLoadedTeachers && isLoadedGroups){
					setStatus(100, '');
					hideSuggestionBySuggestClick();
				}
			}
		}
	});

	function showResult(){
		$('.information').css('display', 'flex');
		$('.weekdays').css('display', 'block');
		anime({
			targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
			duration: anim_time, 
			opacity: 1,
			scale: 1,
			easing: 'easeInOutQuad',
		});
	}

	function showResult2(){
		$('.information').css('display', 'flex');
		$('.weekdays').css('display', 'block');
		$('.information').css('transform', 'translateY(0px)');
		$('.weekdays').css('transform', 'translateY(0px)');
		anime({
			targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
			duration: anim_time, 
			opacity: 1,
			scale: 1,
			easing: 'easeInOutQuad',
		});
	}

	main_input.click(function(){

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			let main_input_position = main_input.offset().top;
			let top_position = $('.headSection').offset().bottom;
			$(document).scrollTop(main_input_position - 10);
		}
	});

	$(document).keyup(function(eventObject){
		if(eventObject.which == 27){
			main_input.blur();
			hideSuggestionBySuggestClick();
			suggest.filter('.suggest_hovered').removeClass('suggest_hovered');
		};
	});

	$(document).click(function(event) {
		if ($(event.target).closest('.suggestion').length) return;
		suggestion.removeClass('suggestion_visible');
		suggestion_active = false;
		event.stopPropagation();
	});

	function getCurrentSubject(){
		let now = new Date().getTime();
		let now2 = new Date();

		let one_start = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 8, 30).getTime();
		let two_start = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 10, 15).getTime();
		let three_start = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 12).getTime();
		let four_start = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 14, 10).getTime();
		let five_start = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 15, 55).getTime();
		let six_start = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 17, 40).getTime();
		let seven_start = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 19, 25).getTime();

		let one_end = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 10, 5).getTime();
		let two_end = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 11, 50).getTime();
		let three_end = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 13, 35).getTime();
		let four_end = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 15, 45).getTime();
		let five_end = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 17, 30).getTime();
		let six_end = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 19, 15).getTime();
		let seven_end = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate(), 21).getTime();

		if (now > one_start && now < one_end) return ["sub", "10:05"];
		else if (now > two_start && now < two_end) return ["sub", "11:50"];
		else if (now > three_start && now < three_end) return ["sub", "13:35"];
		else if (now > four_start && now < four_end) return ["sub", "15:45"];
		else if (now > five_start && now < five_end) return ["sub", "17:30"];
		else if (now > six_start && now < six_end) return ["sub", "19:15"];
		else if (now > seven_start && now < seven_end) return ["sub", "21:00"];
		
		else if (now < one_start && now < one_end) return ["nothing", "08:30"];
		else if (now < two_start && now > one_end) return ["pause", "11:50", "10:15"];
		else if (now < three_start && now > two_end) return ["pause", "13:35", "12:00"];
		else if (now < four_start && now > three_end) return ["pause", "15:45", "14:10"];
		else if (now < five_start && now > four_end) return ["pause", "17:30", "15:55"];
		else if (now < six_start && now > five_end) return ["pause", "19:15", "17:40"];
		else if (now < seven_start && now > six_end) return ["pause", "21:00", "end"];
		else if (now > seven_end) return ["nothing", "08:30"];

		else return "0";
	}

	// чётная/нечётная неделя (наоборот)
	function getWeekNum(day, month, year){
		month++;
		var a = Math.floor((14-month) / 12);
		var y = year + 4800 - a;
		var m = month + 12 * a - 3;
		var J = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y/4) - 
		Math.floor(y/100) + Math.floor(y/400) - 32045;
		d4 = (((J + 31741 - (J % 7)) % 146097) % 36524) % 1461;
		var L = Math.floor(d4 / 1460);
		var d1 = ((d4 - L) % 365) + L;
		var week = Math.floor(d1/7) + 1;
		if (week < 10) week='0'+week; // Лидирующий ноль для недель 1-9

		if (week % 2 == 0) return 1; 
		else return 2; 
	}

	function deleteCurrentSub(){
		$('.next').css('display', 'none');
	}

	function setCurrentSub(sub){

		let type;
		if (sub.type != ''){
			$('.next_sub_type-mobile').html(sub.type.toUpperCase());
			type = '<span class="next_sub_type next_sub_type-novisible">' + sub.type.toUpperCase() + '</span>';
		}

		else
			$('.next_sub_type-mobile').css('display', 'none');

		if (type != undefined)
			$('.next_sub').html(sub.subject + type);
		else
			$('.next_sub').html(sub.subject);

		$('.next_time').html(sub.time);

		if (sub.place == '' && sub.teacher == ''){
			$('.circle').hide();
			$('.next_place').hide();
			$('.next_teacher').hide();
		}

		else {
			$('.circle').show();
			$('.next_place').show();
			$('.next_teacher').show();
			$('.next_place').html(sub.place);
			$('.next_teacher').html(sub.teacher);
		}

		$('.next').css('display', 'block');
	}

	function TimeOverInit(end_time){
		let now = new Date();
		let hour = parseInt(end_time.substr(0, 2));
		let minutes = parseInt(end_time.substr(3, 2));
		let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes).getTime();
		// console.log(Math.floor((end - now2)/(1000 * 60)));

		TimeOverGo(end);
	}

	function TimeOverGo(end){
		let now2 = new Date().getTime();
		let diff = Math.floor((end - now2)/(1000 * 60));
		let str_min;
		console.log('Время идет ' + diff);
		if (diff > 60 && diff < 83){
			// console.log('1 час ' + diff);
			let min = diff - 60;
			str_min = getEndWordMinutes(min);
			$('.next_label_time').html('остался 1 ч. ' + min + ' ' + str_min);
		}

		else if (diff <= 95 && diff >= 90){
			// console.log('2 часа ' + diff);
			$('.next_label_time').html('только началось');
		}

		else if (diff < 90 && diff >= 85){
			// console.log('5 минут ' + diff);
			$('.next_label_time').html('началось 5 мин. назад');
		}

		else if (diff < 85 && diff >= 80){
			$('.next_label_time').html('началось 10 мин. назад');
		}

		else if (diff < 60){
			str_min = getEndWordMinutes(diff);
			let diff_str = diff.toString();
			// console.log(diff_str[diff_str.length - 1] + ' 1 минута');
			if (diff_str[diff_str.length - 1] == 1 && diff_str != 11){
				$('.next_label_time').html('осталась ' + diff + ' ' + str_min);
			}
			else if(diff_str == 11){
				$('.next_label_time').html('осталось ' + diff + ' ' + str_min);
			}
			else{
				// console.log('осталось');
				$('.next_label_time').html('осталось ' + diff + ' ' + str_min);
			}
		}

		if (diff == 0 || diff > 95){
			// console.log('Больше 1.20' + diff);
			$('.next').css('display', 'none');
			console.log('Предмет закончился');
			return;
		}
		else if (diff > 0){
			setInterval(TimeOverGo, 60000, end);
		}
	}

	function getEndWordMinutes(min){
		min = min.toString();
		console.log(min.length + ' ' + min[min.length - 1]);
		if (min == 11)
			return 'минут'
		else if (min == 1 || min[min.length - 1] == 1)
			return 'минута'
		else if (min == 2 || min == 3 || min == 4 || 
			(min[min.length - 1] == 2 && min[min.length - 2] != 1) ||
			(min[min.length - 1] == 3 && min[min.length - 2] != 1) ||
			(min[min.length - 1] == 4 && min[min.length - 2] != 1))
			return 'минуты'

		else if ((min.length == 2 || min.length == 3) && (min[min.length - 2] == 1) && (min[min.length - 1] == 1 ||
			min[min.length - 1] == 2 ||
			min[min.length - 1] == 3 ||
			min[min.length - 1] == 4))
			return 'минут'

		else
			return 'минут'
	}

	let subject_starts = ['08:30', '10:15', '12:00', '14:10', '15:55', '17:40', '19:25'];
	let subject_ends = ['10:05', '11:50', '13:35', '15:45', '17:30', '19:15', '21:00'];

	function getSubStartTimeNext(end_time_previous){
		for (let index = 0; index < subject_starts.length; index++) {
			if (end_time_previous == subject_ends[index]){
				return subject_starts[index + 1];
			}

			else return "0";
		}
	}

	function getSubTodayNew(){
		// let end_time = getCurrentSubject();
		let sub_today = getCurrentSubject();
		let end_time = sub_today[1];
		console.log('проверка предмета ' + sub_today[0]);
		if (end_time != "0" && sub_today[0] == "sub"){
			$('.today__content_today').each(function(){
				if ($(this).attr('data-time') == undefined){
					return;
				}
				if ($(this).attr('data-time').substr(6, 5) == end_time){
					$(this).addClass('today__content_goes');
					$(this).find('.today__content-subject-middle').append('<div class="today__content-subject-remaining">осталось 42 мин.</div>');
					let next_subject_time_starts = getSubStartTimeNext(end_time);
					console.log('следующий предмет будет: ', next_subject_time_starts);
					TimeOverInitNew(end_time, $(this), next_subject_time_starts);
					console.log('Пара нашлась');
				}
			});
		}

		else if (end_time != "0" && sub_today[0] == "pause"){
			$('.today__content_today').each(function(){
				if ($(this).attr('data-time') == undefined){
					return;
				}
				if ($(this).attr('data-time').substr(6, 5) == end_time){
					$(this).addClass('today__content_starts');
					$(this).find('.today__content-subject-middle').append('<div class="today__content-subject-starts">начнётся через 42 мин.</div>');
					PauseTimeOverInitNew(end_time, $(this), sub_today[2]);
					console.log('Перемена нашлась');
				}
			});
		}
	}

	var subGoesInterval;
	var subEndsTimeout;

	var pauseGoesInterval;
	var pauseEndsTimeout;

	function PauseTimeOverInitNew(end_time, subject, pause_end){
		console.log(pause_end + ' конец перемены');
		let now = new Date();
		let nowTimeStamp = new Date().getTime();
		let hour = parseInt(pause_end.substr(0, 2));
		let minutes = parseInt(pause_end.substr(3, 2));
		let pause_end_obj = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes).getTime();
		console.log(Math.floor((pause_end_obj - nowTimeStamp)/60000));

		// let diff2;
		
		
		let diffPauseEnd = pause_end_obj - nowTimeStamp;
		// diff2 = next_subject_time - end;

		PauseTimeOverGoNew(pause_end_obj);
		pauseGoesInterval = setInterval(PauseTimeOverGoNew, 60000, pause_end_obj);
		pasueEndsTimeout = setTimeout(function(){
			clearInterval(pauseGoesInterval);
			console.log('перемена закончилась');
			subject.removeClass('today__content_starts');
			$('.today__content-subject-starts').remove();
			getSubTodayNew();

		}, diffPauseEnd);

	}

	function PauseTimeOverGoNew(end, subject){
		let now2 = new Date().getTime();
		let diff = Math.floor((end - now2)/(1000 * 60));
		console.log('начнется через '+ diff);

		if (diff == 1 || diff == 21 || diff == 31){
			console.log('1');
			if(diff == 1){
				$('.today__content-subject-starts').html('начнётся через 1 минуту');
			}

			else if(diff == 21){
				$('.today__content-subject-starts').html('начнётся через 21 минуту');
			}

			else if(diff == 31){
				$('.today__content-subject-starts').html('начнётся через 31 минуту');
			}
		}

		else if (diff == 4 || diff == 24 || diff == 34){
			console.log('4');
			if(diff == 4){
				$('.today__content-subject-starts').html('начнётся через 4 минуты');
			}

			else if(diff == 24){
				$('.today__content-subject-starts').html('начнётся через 24 минуты');
			}

			else if(diff == 34){
				$('.today__content-subject-starts').html('начнётся через 34 минуты');
			}
		}

		else if (diff == 3 || diff == 23 || diff == 33){
			console.log('3');
			if(diff == 3){
				$('.today__content-subject-starts').html('начнётся через 3 минуты');
			}

			else if(diff == 23){
				$('.today__content-subject-starts').html('начнётся через 23 минуты');
			}

			else if(diff == 33){
				$('.today__content-subject-starts').html('начнётся через 33 минуты');
			}
		}

		else if (diff == 2 || diff == 22 || diff == 32){
			console.log('2');
			if(diff == 2){
				$('.today__content-subject-starts').html('начнётся через 2 минуты');
			}

			else if(diff == 22){
				$('.today__content-subject-starts').html('начнётся через 22 минуты');
			}

			else if(diff == 32){
				$('.today__content-subject-starts').html('начнётся через 32 минуты');
			}
		}

		else if(diff == 0){
			console.log('0');
			$('.today__content-subject-starts').html('только началось');
		}

		else if (diff > 0 && diff < 36){
			console.log('>0');
			$('.today__content-subject-starts').html('начнётся через '+ diff +' минут');
		}
	}

	function TimeOverInitNew(end_time, subject, next_subject_time_starts){
		let now = new Date();
		let now2 = new Date().getTime();
		let hour = parseInt(end_time.substr(0, 2));
		let minutes = parseInt(end_time.substr(3, 2));
		let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes).getTime();

		let WillNextSub = false;
		let hour_next_subject;
		let minutes_next_subject;
		let next_subject_time;
		let diff2;

		if (next_subject_time_starts != "0"){
			hour_next_subject = parseInt(next_subject_time_starts.substr(0, 2));
			minutes_next_subject = parseInt(next_subject_time_starts.substr(3, 2));
			next_subject_time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour_next_subject, minutes_next_subject).getTime();
			WillNextSub = true;
		}
		
		let diff = end - now2;
		diff2 = next_subject_time - end;

		// console.log(diff + ' время до конца пары');
		// console.log('до начала пары следующ ' + Math.floor(diff2/(1000 * 60)));

		TimeOverGoNew(end);
		subGoesInterval = setInterval(TimeOverGoNew, 60000, end);
		subEndsTimeout = setTimeout(function(){
			clearInterval(subGoesInterval);
			console.log('пара закончилась');
			subject.removeClass('today__content_goes');
			$('.today__content-subject-remaining').remove();

			if (WillNextSub){

				getSubTodayNew();

				console.log('Следующий предмет будет');
				setTimeout(function(){
					// console.log('запускаем следующий предмет ' + Math.floor(diff2/(1000 * 60)));
					getSubTodayNew();
				}, diff2);
			}
			else console.log('Следующего предмета не будет');
		}, diff);
	}

	function TimeOverGoNew(end, subject){
		let now2 = new Date().getTime();
		let diff = Math.floor((end - now2)/(1000 * 60));
		let str_min;
		// let interval = setInterval(TimeOverGoNew, 60000, end);
		// console.log('Новое время идет ' + diff);
		if (diff > 60 && diff < 83){
			// console.log('1 час ' + diff);
			let min = diff - 60;
			str_min = getEndWordMinutes(min);
			$('.today__content-subject-remaining').html('остался 1 ч ' + min + ' ' + str_min);
		}

		else if (diff <= 95 && diff >= 90){
			// console.log('2 часа ' + diff);
			$('.today__content-subject-remaining').html('только началось');
		}

		else if (diff < 90 && diff >= 85){
			// console.log('5 минут ' + diff);
			$('.today__content-subject-remaining').html('началось 5 мин назад');
		}

		else if (diff < 85 && diff >= 80){
			$('.today__content-subject-remaining').html('началось 10 мин назад');
		}

		else if (diff == 0){
			$('.today__content-subject-remaining').html('только что закончилось');
		}

		else if (diff < 60){
			str_min = getEndWordMinutes(diff);
			let diff_str = diff.toString();
			// console.log(diff_str[diff_str.length - 1] + ' 1 минута');
			if (diff_str[diff_str.length - 1] == 1 && diff_str != 11){
				$('.today__content-subject-remaining').html('осталась ' + diff + ' ' + str_min);
			}
			else if(diff_str == 11){
				$('.today__content-subject-remaining').html('осталось ' + diff + ' ' + str_min);
			}
			else{
				// console.log('осталось');
				$('.today__content-subject-remaining').html('осталось ' + diff + ' ' + str_min);
			}
		}
	}

	function getSubToday(){
		let end_time = getCurrentSubject();
		// console.log(end_time + ' окончательное время');
		if (end_time != "0"){
			$.getJSON(BASE_API_URL + main_input.val().toLowerCase(), function(data) {

				let date = new Date();
				let currentDay = date.getDay();
				let currentWeek = getWeekNum(date.getDate(), date.getMonth(), date.getFullYear());
				let sub;

				for (var i = data.timetable.length - 1; i >= 0; i--) {
					if (data.timetable[i].day == currentDay && data.timetable[i].week == currentWeek
						&& data.timetable[i].time.substr(6, 5) == end_time){
						sub = data.timetable[i];
					}
				}

				if (sub){
					setCurrentSub(sub);
					TimeOverInit(end_time);
				}

				else{
					deleteCurrentSub();
					console.log('Нет текущего предмета');
				}

			});
		}
	}

	function repaint(){
		// amplitude.getInstance().logEvent('Перерисовка - начало', {'group' : main_input.val()});
		var inst = localStorage.getItem('inst');
		$('.search-icon-load').removeClass('none');
		$('.search-icon-search').addClass('none');
		setStatus(3, 'Загрузка...');
		anime({
			targets: ['.weekdays', '.information', '.contact', '.today__block-today'],
			// targets: ['.information', '.contact'],
			duration: 200, 
			opacity: 0,
			// scale: 0.99,
			easing: 'easeInOutQuad',
			complete: function(){
				isSlowConnection();
				makeTimetable(function(){
					clearSlowConnection();
					setInformation(inst);
					showResult2();
					amplitude.getInstance().logEvent('Ранее введенная группа загрузилась', {'group' : main_input.val()});
					getSubTodayNew();
					IS_TIMETABLE_LOADED = true;
					$('.search-icon-load').addClass('none');
					$('.search-icon-search').removeClass('none');
					$('.contact').addClass('contact_visible');
				});
			}
		});
	}	
});


