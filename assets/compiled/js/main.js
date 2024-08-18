document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded.');

    // Парсим CSV файл
    Papa.parse('assets/data/passengers.csv', {
        download: true,
        header: true,
        complete: function (results) {
            console.log('CSV loaded:', results.data);
            createCards(results.data);
        },
        error: function (error) {
            console.error('Error loading CSV:', error);
        }
    });

    // Функция создания карточек
    function createCards(data) {
        const container = document.getElementById('cardsContainer');
        container.innerHTML = ''; // Очищаем контейнер перед созданием карточек

        data.forEach(person => {
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3');
            card.innerHTML = `
            <div class="d-flex flex-row justify-content-between align-items-center">
                <div class="card-body">
                    <h5 class="card-title">${person['Пассажир']}</h5>
                    <p class="card-text"><strong>Документ:</strong> ${person['Документ_кр']}</p>
                    <p class="card-text">
                        <strong>Вагон:</strong> ${person['Вагон']}, 
                        <strong>Место:</strong> ${person['Место']}
                        ${person['Тип льготы'] ? `<span class="highlighted-text"> ${person['Тип льготы']}</span>` : ''}
                    </p>
                    <p class="card-text"><strong>Номер билета:</strong> ${person['Номер билета']}</p>
                </div>
                <a href="#" class="btn btn-primary btn-details d-flex justify-content-center align-items-center" style="height:170px;" onclick="showDetails(event, ${JSON.stringify(person).replace(/\"/g, '&quot;')})">
                    <i class="bi bi-info-circle fs-1"></i>
                </a>
            </div>
        `;

            container.appendChild(card);
        });
    }

    // Функция поиска
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    function handleSearch(event) {
        const query = event.target.value.toLowerCase();
        const cards = document.querySelectorAll('#cardsContainer .card');
        let found = false;

        cards.forEach(card => {
            const textContent = card.textContent.toLowerCase();
            if (textContent.indexOf(query) > -1) {
                card.style.display = 'block';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });

        document.getElementById('notFoundMessage').style.display = found ? 'none' : 'block';
    }

    // Функция показа подробной информации
    window.showDetails = function (event, person) {
        event.preventDefault();
        history.pushState({ view: 'details' }, '', '#details'); // Добавляем состояние в историю браузера

        const container = document.getElementById('cardsContainer');
        container.innerHTML = ''; // Очищаем контейнер

        const detailsCard = document.createElement('div');
        detailsCard.classList.add('card');

        detailsCard.innerHTML = `
        <div class="card-body">
            <div class="row mb-2">
                <div class="col-sm-6">
                    Пассажир:<br>
                    <h6 class="card-title">${person['Пассажир']}</h6>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-sm-6">
                    Пол: <strong>${person['Пол']}</strong> 
                    Гражданство: <strong>${person['Гражданство']}</strong> 
                </div>
            </div>
            <div class="mb-2">
                ${person['Тип паспорта']}:<br>
                <strong>${person['Документ']}</strong><br>
            </div>
            <div class="mb-2">
                Дата рождения:<br>
                <strong>${person['Дата рождения']}</strong>
            </div>
            <div class="row mb-2">
                <div class="col-sm-6">
                    Вагон: <strong>${person['Вагон']}</strong> 
                    Место: <strong>${person['Место']}</strong> 
                </div>
            </div>
            <hr>
            <div class="mb-2">
                <strong>Номер билета:</strong><br>
                ${person['Номер билета']}
            </div>
            <div class="mb-2">
                <strong>Вид билета:</strong><br>
                ${person['Тип билета']}
            </div>
            <hr>
            <div class="mb-2">
               <strong> ${person['Вид билета']}</strong>
            </div>
            <hr>    
            <div class="row mb-2">
                <div class="col-sm-6">
                    Поезд: <strong>${person['Поезд']}</strong> 
                    Тип вагона: <strong> ${person['Тип вагона']}</strong>
                    Класс: <strong>${person['Класс']}</strong> 
                </div>
            </div>
            <hr>
            <div class="mb-2">
                <strong>Постельное бельё:</strong><br>
                Безденежно: <strong>${person['Безденежно']}</strong> <br>
                Денежно: <strong>${person['Денежно']}</strong> <br>
            </div>
            <hr>
            <div class="mb-2">
                <strong>Станция посадки:</strong><br>
                ${person['Станция посадки']}
            </div>
            <div class="mb-2">
                <strong>Станция высадки:</strong><br>
                ${person['Станция высадки']}
            </div>
    
            <a href="#" class="btn btn-secondary mt-3" onclick="returnToList(event)">Назад к списку</a>
        </div>
    `;

        container.appendChild(detailsCard);
    }

    // Функция возврата к списку карточек
    window.returnToList = function (event) {
        event && event.preventDefault();
        document.getElementById('searchInput').value = ''; // Очищаем поле поиска
        
        // Загружаем данные из CSV заново для возвращения к списку
        Papa.parse('assets/data/passengers.csv', {
            download: true,
            header: true,
            complete: function (results) {
                createCards(results.data);
            },
            error: function (error) {
                console.error('Error loading CSV:', error);
            }
        });

        history.pushState(null, '', window.location.pathname); // Убираем состояние из истории (очищаем якорь)
    };

    // Обработчик события popstate для кнопки "Назад" в браузере
    window.addEventListener('popstate', function(event) {
        if (!event.state || event.state.view !== 'details') {
            returnToList(); // Если состояние не 'details', возвращаемся к списку карточек
        }
    });
});
